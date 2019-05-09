/**
 * Entry point for Renderer process of WebTorrent page
 */

// To keep the UI snappy, we run WebTorrent in its own hidden window, a separate
// process from the main window.
import ExtendableError from 'es6-error';
import Axios from 'axios';
import store from './store';
import { USER } from './store/modules/auth';
import { AUTHORIZED, UNAUTHORIZED } from './dispatch-types';

console.time('init');

const crypto = require('crypto');
const deepEqual = require('deep-equal');
const electron = require('electron');
const fs = require('fs');
const mkdirp = require('mkdirp');
// const networkAddress = require('network-address')
const path = require('path');
const WebTorrent = require('webtorrent');

// const crashReporter = require('../crash-reporter')
const config = require('./config');

const defaultAnnounceList = config.TRACKER_ANNOUNCE_LIST; // require('create-torrent').announceList

class TorrentError extends ExtendableError {
}

class TorrentKeyNotFoundError extends TorrentError {
  constructor(torrentKey) {
    super(`Can't resolve torrent key ${torrentKey}`);
  }
}

// const torrentPoster = require('./lib/torrent-poster')

// Report when the process crashes
// crashReporter.init()

// Send & receive messages from the main window
const ipc = electron.ipcRenderer;

// Force use of webtorrent trackers on all torrents
global.WEBTORRENT_ANNOUNCE = defaultAnnounceList
  .map(arr => arr[0])
  .filter(url => url.indexOf('wss://') === 0 || url.indexOf('ws://') === 0);

global.GET_STORE = () => store;

global.ICECOMPLETE_TIMEOUT = 5 * 1000;
/**
 * WebTorrent version.
 */
// const VERSION = require('../package.json').version

/**
 * Version number in Azureus-style. Generated from major and minor semver version.
 * For example:
 *   '0.16.1' -> '0016'
 *   '1.2.5' -> '0102'
 */
// const VERSION_STR = VERSION.match(/([0-9]+)/g)
//   .slice(0, 2)
//   .join('')

/**
 * Version prefix string (used in peer ID). WebTorrent uses the Azureus-style
 * encoding: '-', two characters for client id ('WW'), four ascii digits for version
 * number, '-', followed by random numbers.
 * For example:
 *   '-WW0102-'...
 */
const VERSION_PREFIX = '-WD' + '0000' /* VERSION_STR */ + '-';

/**
 * Generate an ephemeral peer ID each time.
 */
const PEER_ID = Buffer.from(VERSION_PREFIX + crypto.randomBytes(9).toString('base64'));

// Connect to the WebTorrent and BitTorrent networks. WebTorrent Desktop is a hybrid
// client, as explained here: https://webtorrent.io/faq
let client = window.client = new WebTorrent({
  peerId: PEER_ID,
  dht: false,
  // iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478?transport=udp"}]
});

function sendPeerId() {
  console.log('prevPeerId', client.peerId);
  const newPeerIdBuffer = Buffer.from(store.getters[USER].peerId);
  console.log('newPeerId string', newPeerIdBuffer.toString('utf-8'));

  client.peerIdBuffer = newPeerIdBuffer;
  client.peerId = newPeerIdBuffer.toString('hex');

  Axios({ url: '/users/peer', data: { peerId: client.peerId }, method: 'PUT' }).then((resp) => {
    console.log('/users/peer response', resp);
  });

  ipc.once(UNAUTHORIZED, () => {
    ipc.once(AUTHORIZED, sendPeerId);
  });
}

ipc.once(AUTHORIZED, sendPeerId);

// Used for diffing, so we only send progress updates when necessary
let prevProgress = null;

init();

function init() {
  listenToClientEvents();

  ipc.on('wt-start-torrenting', (e, torrentKey, torrentID, path, fileModtimes, selections) => {
    // console.log(e, torrentKey, torrentID, path, fileModtimes, selections);
    startTorrenting(torrentKey, torrentID, path, fileModtimes, selections);
  });

  ipc.on('wt-stop-torrenting', (e, infoHash) => stopTorrenting(infoHash));
  ipc.on('wt-create-torrent', (e, torrentKey, options) => createTorrent(torrentKey, options));
  ipc.on('wt-save-torrent-file', (e, torrentKey) => saveTorrentFile(torrentKey));
  ipc.on('wt-select-files', (e, infoHash, selections) => selectFiles(infoHash, selections));

  ipc.on('wt-reset', () => reset());

  console.log('ipcReadyWebTorrent');
  ipc.send('ipcReadyWebTorrent');

  window.addEventListener('error', e => ipc.send('wt-uncaught-error', {
    message: e.error ? e.error.message : String(e),
    stack: e.error ? e.error.stack : void 0,
  }),
  true);

  setInterval(updateTorrentProgress, 1000);
  console.timeEnd('init');
}

function listenToClientEvents() {
  client.on('warning', (err) => {
    console.warn(err.message);
    ipc.send('wt-warning', null, err.message);
  });
  client.on('error', (err) => {
    console.error(err.message);
    ipc.send('wt-error', null, err.message);
  });
}

// Starts a given TorrentID, which can be an infohash, magnet URI, etc.
// Returns a WebTorrent object. See https://git.io/vik9M
function startTorrenting(torrentKey, torrentID, path, fileModtimes, selections) {
  console.log('wt-start-torrenting');
  console.log('starting torrent %s: %s', torrentKey, torrentID);

  const torrent = client.add(torrentID, {
    path,
    fileModtimes,
    // announce: 'wss://tracker.webtorrent.io'
  });
  torrent.key = torrentKey;

  // Listen for ready event, progress notifications, etc
  addTorrentEvents(torrent);

  // Only download the files the user wants, not necessarily all files
  torrent.once('ready', () => selectFiles(torrent, selections));
}

function stopTorrenting(infoHash) {
  console.log('--- STOP TORRENTING: ', infoHash);
  const torrent = client.get(infoHash);
  if (torrent) torrent.destroy();
}

// Create a new torrent, start seeding
function createTorrent(torrentKey, options = {}) {
  console.log('creating torrent', torrentKey, options);
  const paths = options.files.map(f => f.path);
  // Force private
  options.private = true;
  console.log('START SEEDING');
  const torrent = client.seed(paths, options);
  torrent.key = torrentKey;
  addTorrentEvents(torrent);
  ipc.send('wt-new-torrent');
}

// function requestToPair(request, pieceLength) {
//   const pieceIndex = request.piece;
//   const fileOffset = pieceIndex * pieceLength + request.offset;
//
//   return {
//     blockOffset: fileOffset || 0,
//     blockLength: request.length,
//   };
// }

function addTorrentEvents(torrent) {
  // let previousDownloadRequests = {};
  // let previousUploadRequests = {};
  let downloadedPieces = [];
  let uploadedPieces = [];
  // let currentDownloadRequests = {};
  // let currentUploadRequests = {};
  // const checkRequests = {};
  // const checkPeerRequests = {};
  // let numberOfDownloadedBytes = 0;
  // let numberOfUploadedBytes = 0;
  // let peerId = '';
  const keys = Object.keys(torrent).sort();
  console.log('keys:', keys);

  const t = store.getters.findTorrentByKey(torrent.key);
  const gameId = t && t.gameId;
  const userId = store.getters[USER].id;
  // const defaultBlockSize = 16384;

  torrent.on('download', (bytes) => {
    console.log('torrent download bytes:', bytes);
    // numberOfDownloadedBytes += bytes;

    if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length >= 24) {
      Axios({ url: '/user-game-download-blocks/group', data: downloadedPieces, method: 'POST' }).then((res) => {
        console.log('wire download add group done', res);
      }).catch((err) => {
        console.log('wire download add group error:', err);
      });

      downloadedPieces = [];
    }
  });

  torrent.on('upload', (bytes) => {
    console.log('torrent upload bytes:', bytes);
    // numberOfUploadedBytes += bytes;
  });

  torrent.on('warning', err => ipc.send('wt-warning', torrent.key, err.message));
  torrent.on('error', err => ipc.send('wt-error', torrent.key, err.message));
  torrent.on('infoHash', () => ipc.send('wt-infohash', torrent.key, torrent.infoHash));
  torrent.on('metadata', torrentMetadata);
  torrent.on('ready', torrentReady);
  torrent.on('done', () => {
    console.log('torrent done');
    console.log(downloadedPieces);
    // console.log('numberOfDownloadedBytes:', numberOfDownloadedBytes);
    // console.log('numberOfUploadedBytes:', numberOfUploadedBytes);

    // let i = 0;
    // while (i < numberOfDownloadedBytes) {
    //   if (!checkRequests[i]) {
    //     console.log(`block with offset ${i} is absent`);
    //     const downloadedBlock = {
    //       blockOffset: i,
    //       blockLength: defaultBlockSize,
    //       gameId,
    //       peerId,
    //       userId,
    //       autoFix: true,
    //     };
    //
    //     Axios({ url: '/user-game-download-blocks/group', data: [downloadedBlock], method: 'POST' }).catch((response) => {
    //       console.log('wire download add group error:', response);
    //     });
    //
    //     i += defaultBlockSize;
    //   } else {
    //     i += checkRequests[i].blockLength;
    //   }
    // }

    if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length) {
      Axios({ url: '/user-game-download-blocks/group', data: downloadedPieces, method: 'POST' })
        .then((res) => {
          console.log('wire download add group done', res);
        })
        .catch((err) => {
          console.log('wire download add group error:', err);
        });

      downloadedPieces = [];
    }

    torrentDone();
  });
  torrent.on('peer', (peer) => {
    console.log('new peer', peer);
  });
  torrent.on('wire', (wire, addr) => {
    console.log('wire peerId utf-8 string', Buffer.from(wire.peerId, 'hex').toString('utf-8'));
    const wireRequests = [];

    console.log('wire', wire);
    console.log(`connected to remote peer with ID ${wire.peerId} and address ${addr}, torrenting game ${gameId}`);
    console.log('torrent', torrent);

    wire.on('close', () => {
      console.log('wire closed. Send stats to server');

      if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length) {
        Axios({ url: '/user-game-download-blocks/group', data: downloadedPieces, method: 'POST' })
          .then((res) => {
            console.log('wire download add group done', res);
          })
          .catch((err) => {
            console.log('wire download add group error:', err);
          });

        downloadedPieces = [];
      }

      if (uploadedPieces && Array.isArray(uploadedPieces) && uploadedPieces.length) {
        Axios({ url: '/user-game-upload-blocks/group', data: uploadedPieces, method: 'POST' })
          .then((res) => {
            console.log('wire upload add group done', res);
          })
          .catch((err) => {
            console.log('wire upload add group error:', err);
          });

        uploadedPieces = [];
      }

    });

    // let previousDownloadRequests = {};
    // let currentDownloadRequests = {};

    // if (wire.requests) {
    //   wire.requests.forEach((request) => {
    //     const pieceIndex = request.piece;
    //     const pair = requestToPair(request, torrent.pieceLength);
    //
    //     const downloadedBlock = {
    //       blockOffset: pair.blockOffset,
    //       blockLength: pair.blockLength,
    //       gameId,
    //       peerId: wire.peerId,
    //       userId,
    //     };
    //
    //     if (!previousDownloadRequests[pieceIndex]) {
    //       previousDownloadRequests[pieceIndex] = {};
    //     }
    //
    //     previousDownloadRequests[pieceIndex][downloadedBlock.blockOffset] = downloadedBlock;
    //   });
    // }

    // console.log('torrent wire keys:', Object.keys(wire).sort());
    // console.log('torrent wire addr:', addr);

    // peerId = wire.peerId;

    ipc.send('wt-wire-connect', torrent.key, addr);

    wire.on('interested', () => {
      console.log(`peer ${addr} is now interested in ${wire.peerInterested ? 'us' : ''}`);
    });

    wire.on('piece', (index, offset, buffer) => {
      const downloadedBlock = {
        blockOffset: index * torrent.pieceLength + offset,
        blockLength: buffer.length,
        gameId,
        peerId: wire.peerId,
        userId,
      };

      if (!downloadedPieces) {
        downloadedPieces = [];
      }

      downloadedPieces.push(downloadedBlock);
    });

    wire.on('uninterested', () => {
      console.log(`peer ${addr} is no longer interested`);
      if (uploadedPieces && Array.isArray(uploadedPieces) && uploadedPieces.length) {
        Axios({ url: '/user-game-upload-blocks/group', data: uploadedPieces, method: 'POST' })
          .then((res) => {
            console.log('wire upload add group done', res);
          })
          .catch((err) => {
            console.log('wire upload add group error:', err);
          });

        uploadedPieces = [];
      }
    });

    wire.on('handshake', (infoHash, peerId, extensions) => {
      console.log('wire handshake', { infoHash, peerId, extensions });
    });

    wire.on('choke', () => {
      console.log('peer is now choking us');
    });

    wire.on('unchoke', () => {
      console.log('peer unchoked us');
    });

    wire.on('request', (pieceIndex, offset, length) => {
      const request = wire.peerRequests.filter(val => val.piece === pieceIndex && val.offset === offset && val.length === length).shift();

      if (request) {
        wireRequests.push({
          request, pieceIndex, offset, length,
        });
      }

      // console.log('wire request', { pieceIndex, offset, length });
    });

    wire.on('have', (index) => {
      console.log(`wire have ${index}`);
    });

    wire.on('timeout', () => {
      console.log(`wire timeout ${wire.addr}. Destroy...`);
    });

    // wire.on('bitfield', (wire, bitfield) => {
    //   console.log(`bitfield received from the peer with ID ${wire.peerId}: ${bitfield}`);
    // });
    wire.on('download', () => {
      // console.log(`number of bytes downloaded ${wire.downloaded} from peerId ${wire.peerId}/${addr}/${gameId}`);
      // console.log('wire download wire.peerId:', wire.peerId);
      // console.log('wire download bytes:', bytes);
      // console.log('wire.downloaded:', wire.downloaded);

      // currentDownloadRequests = {};
      //
      // if (wire.requests) {
      //   wire.requests.forEach((request) => {
      //     const pieceIndex = request.piece;
      //     const pair = requestToPair(request, torrent.pieceLength);
      //
      //     const downloadedBlock = {
      //       blockOffset: pair.blockOffset,
      //       blockLength: pair.blockLength,
      //       gameId,
      //       peerId: wire.peerId,
      //       userId,
      //     };
      //
      //     if (!currentDownloadRequests[pieceIndex]) {
      //       currentDownloadRequests[pieceIndex] = {};
      //     }
      //
      //     currentDownloadRequests[pieceIndex][downloadedBlock.blockOffset] = downloadedBlock;
      //     // checkRequests[downloadedBlock.blockOffset] = downloadedBlock;
      //   });
      // }
      //
      // // const downloadedRequests = [];
      //
      // const pieceIndexes = Object.keys(previousDownloadRequests) || [];
      //
      // if (!pieceIndexes.length) {
      //   console.log('Downloaded block is lost');
      //   console.log(previousDownloadRequests);
      //   console.log(currentDownloadRequests);
      // }
      //
      // pieceIndexes.forEach((pIndex) => {
      //   if (!currentDownloadRequests[pIndex]) {
      //     if (downloadedPieces[pIndex] && Array.isArray(downloadedPieces[pIndex])) {
      //       downloadedPieces[pIndex].concat(Object.values(previousDownloadRequests[pIndex]));
      //     } else {
      //       downloadedPieces[pIndex] = Object.values(previousDownloadRequests[pIndex]);
      //     }
      //
      //     Axios({ url: '/user-game-download-blocks/group', data: downloadedPieces[pIndex], method: 'POST' }).then((res) => {
      //       console.log('wire piece index', pIndex);
      //       console.log('wire download add group done', res);
      //     }).catch((err) => {
      //       console.log('wire download add group error:', err);
      //     });
      //
      //     delete downloadedPieces[pIndex];
      //   } else {
      //     const blockIndexes = Object.keys(previousDownloadRequests[pIndex]) || [];
      //
      //     blockIndexes.forEach((bIndex) => {
      //       if (!currentDownloadRequests[pIndex][bIndex]) {
      //         if (downloadedPieces[pIndex] && Array.isArray(downloadedPieces[pIndex])) {
      //           downloadedPieces[pIndex].push(previousDownloadRequests[pIndex][bIndex]);
      //         } else {
      //           downloadedPieces[pIndex] = [previousDownloadRequests[pIndex][bIndex]];
      //         }
      //       }
      //     });
      //   }
      // });

      // console.log('downloaded:', downloadedRequests);
      // if (downloadedRequests.length > 0) {
      //   Axios({ url: '/user-game-download-blocks/group', data: downloadedRequests, method: 'POST' }).then((request) => {
      //     console.log('wire download add group done', request);
      //   }).catch((response) => {
      //     console.log('wire download add group error:', response);
      //   });
      //
      //   // AppUserGameDownloadBlockService.addGroup(authorization, downloadedRequests)
      //   //   .then(() => {
      //   //     console.log('wire download add group done');
      //   //   })
      //   //   .catch((response) => {
      //   //     console.log('wire download add group error:', response);
      //   //   });
      // }
      // previousDownloadRequests = currentDownloadRequests;
      // Axios({ url: `/games/1/stats/${wire.downloaded}`, data: { peerId: wire.peerId, ip: addr }, method: 'PUT' });
    });

    wire.on('upload', () => {
      wireRequests.forEach((value, key) => {
        if (!wire.peerRequests.includes(value.request)) {
          const uploadedBlock = {
            blockOffset: value.pieceIndex * torrent.pieceLength + value.offset,
            blockLength: value.length,
            gameId,
            peerId: wire.peerId,
            userId,
          };

          if (!uploadedPieces) {
            uploadedPieces = [];
          }

          uploadedPieces.push(uploadedBlock);

          wireRequests.splice(key, 1);

          return false;
        }
      });

      if (uploadedPieces.length >= 24) {
        if (uploadedPieces && Array.isArray(uploadedPieces) && uploadedPieces.length) {
          Axios({ url: '/user-game-upload-blocks/group', data: uploadedPieces, method: 'POST' })
            .then((res) => {
              console.log('wire upload add group done', res);
            })
            .catch((err) => {
              console.log('wire upload add group error:', err);
            });

          uploadedPieces = [];
        }
      }
      // console.log(`number of bytes uploaded ${wire.uploaded} to peerId ${wire.peerId}/${addr}/${gameId}`);
      // console.log('wire upload gameId', gameId);
      // console.log('wire upload wire.peerId:', wire.peerId);
      // console.log('wire upload bytes:', bytes);
      // console.log('wire upload requests:', wire.requests);
      // console.log('wire upload peerRequests:', wire.peerRequests);

      // currentUploadRequests = {};
      //
      // if (wire.peerRequests) {
      //   wire.peerRequests.forEach((request) => {
      //     const pair = requestToPair(request, torrent.pieceLength);
      //
      //     const uploadedBlock = {
      //       blockOffset: pair.blockOffset,
      //       blockLength: pair.blockLength,
      //       gameId,
      //       peerId: wire.peerId,
      //       userId,
      //     };
      //
      //     currentUploadRequests[uploadedBlock.blockOffset] = uploadedBlock;
      //     checkPeerRequests[uploadedBlock.blockOffset] = uploadedBlock;
      //   });
      // }
      //
      // const uploadedRequests = [];
      // const keys = Object.keys(previousUploadRequests) || [];
      // keys.forEach((key) => {
      //   if (!currentUploadRequests[key]) {
      //     uploadedRequests.push(previousUploadRequests[key]);
      //   }
      // });
      // console.log('uploaded:', uploadedRequests);
      // if (uploadedRequests.length > 0) {
      //   Axios({ url: '/user-game-upload-blocks/group', data: uploadedRequests, method: 'POST' }).then((request) => {
      //     console.log('wire upload add group done', request);
      //   }).catch((response) => {
      //     console.log('wire upload add group error:', response);
      //   });
      //
      //   // AppUserGameDownloadBlockService.addGroup(authorization, downloadedRequests)
      //   //   .then(() => {
      //   //     console.log('wire download add group done');
      //   //   })
      //   //   .catch((response) => {
      //   //     console.log('wire download add group error:', response);
      //   //   });
      // }
      //
      // previousUploadRequests = currentUploadRequests;
    });
  });
  torrent.on('noPeers', (announceType) => {
    console.log(`noPeers after announceType=${announceType}`);
    ipc.send('wt-no-peers', torrent.key, announceType);
  });

  function torrentMetadata() {
    const info = getTorrentInfo(torrent);
    ipc.send('wt-metadata', torrent.key, info);

    updateTorrentProgress();
  }

  function torrentReady() {
    const info = getTorrentInfo(torrent);
    console.log('torrentReady');
    ipc.send('wt-ready', torrent.key, info);
    ipc.send(`wt-ready-${torrent.infoHash}`, torrent.key, info);

    updateTorrentProgress();
  }

  function torrentDone() {
    const info = getTorrentInfo(torrent);
    ipc.send('wt-done', torrent.key, info);

    updateTorrentProgress();

    torrent.getFileModtimes((err, fileModtimes) => {
      if (err) return onError(err);
      ipc.send('wt-file-modtimes', torrent.key, fileModtimes);
    });
  }
}

// Produces a JSON saveable summary of a torrent
function getTorrentInfo(torrent) {
  return {
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    name: torrent.name,
    path: torrent.path,
    files: torrent.files.map(getTorrentFileInfo),
    bytesReceived: torrent.received,
  };
}

// Produces a JSON saveable summary of a file in a torrent
function getTorrentFileInfo(file) {
  return {
    name: file.name,
    length: file.length,
    path: file.path,
  };
}

// Every time we resolve a magnet URI, save the torrent file so that we can use
// it on next startup. Starting with the full torrent metadata will be faster
// than re-fetching it from peers using ut_metadata.
function saveTorrentFile(torrentKey) {
  const user = store.getters[USER];
  const torrent = getTorrent(torrentKey);
  const torrentsDir = path.join(
    (electron.app || electron.remote.app).getPath('userData'),
    'torrents',
  );
  const torrentsUserDir = path.join(torrentsDir, user.username);
  if (!fs.existsSync(torrentsDir)) fs.mkdirSync(torrentsDir, { recursive: true });

  const fileName = `${torrent.infoHash}.torrent`;
  const torrentPath = path.join(torrentsUserDir, fileName);
  fs.access(torrentPath, fs.constants.R_OK, (err) => {
    if (!err) {
      // We've already saved the file
      return ipc.send('wt-file-saved', torrentKey, fileName);
    }

    mkdirp(torrentsUserDir, () => {
      fs.writeFile(torrentPath, torrent.torrentFile, (err) => {
        if (err) return console.log('error saving torrent file %s: %o', torrentPath, err);
        console.log('saved torrent file %s', torrentPath);
        return ipc.send('wt-file-saved', torrentKey, fileName);
      });
    });
  });
}

function updateTorrentProgress() {
  const progress = getTorrentProgress();
  // TODO: diff torrent-by-torrent, not once for the whole update
  if (prevProgress && deepEqual(progress, prevProgress, { strict: true })) {
    return; /* don't send heavy object if it hasn't changed */
  }
  ipc.send('wt-progress', progress);
  prevProgress = progress;
}

function getTorrentProgress() {
  // First, track overall progress
  const { progress } = client;
  const hasActiveTorrents = client.torrents.some(torrent => torrent.progress !== 1);

  // Track progress for every file in each torrent
  // TODO: ideally this would be tracked by WebTorrent, which could do it
  // more efficiently than looping over torrent.bitfield
  const torrentProg = client.torrents.map((torrent) => {
    const fileProg = torrent.files && torrent.files.map((file) => {
      const numPieces = file._endPiece - file._startPiece + 1;
      let numPiecesPresent = 0;
      for (let piece = file._startPiece; piece <= file._endPiece; piece++) {
        if (torrent.bitfield.get(piece)) numPiecesPresent++;
      }
      return {
        startPiece: file._startPiece,
        endPiece: file._endPiece,
        numPieces,
        numPiecesPresent,
      };
    });
    return {
      torrentKey: torrent.key,
      ready: torrent.ready,
      progress: torrent.progress,
      downloaded: torrent.downloaded,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      numPeers: torrent.numPeers,
      length: torrent.length,
      bitfield: torrent.bitfield,
      files: fileProg,
    };
  });

  return {
    torrents: torrentProg,
    progress,
    hasActiveTorrents,
  };
}

function selectFiles(torrentOrInfoHash, selections) {
  // Get the torrent object
  let torrent;
  if (typeof torrentOrInfoHash === 'string') {
    torrent = client.get(torrentOrInfoHash);
  } else {
    torrent = torrentOrInfoHash;
  }
  if (!torrent) {
    throw new Error(`selectFiles: missing torrent ${torrentOrInfoHash}`);
  }

  // Selections not specified?
  // Load all files. We still need to replace the default whole-torrent
  // selection with individual selections for each file, so we can
  // select/deselect files later on
  if (!selections) {
    selections = torrent.files.map(() => true);
  }

  // Selections specified incorrectly?
  if (selections.length !== torrent.files.length) {
    throw new Error(`got ${selections.length} file selections, `
      + `but the torrent contains ${torrent.files.length} files`);
  }

  // Remove default selection (whole torrent)
  torrent.deselect(0, torrent.pieces.length - 1, false);

  // Add selections (individual files)
  for (let i = 0; i < selections.length; i++) {
    const file = torrent.files[i];
    if (selections[i]) {
      file.select();
    } else {
      console.log(`deselecting file ${i} of torrent ${torrent.name}`);
      file.deselect();
    }
  }
}

// Gets a WebTorrent handle by torrentKey
// Throws an Error if we're not currently torrenting anything w/ that key
function getTorrent(torrentKey) {
  const ret = client.torrents.find(x => x.key === torrentKey);
  if (!ret) throw new TorrentKeyNotFoundError(torrentKey);
  return ret;
}

function onError(err) {
  console.log(err);
}

// TODO: remove this once the following bugs are fixed:
// https://bugs.chromium.org/p/chromium/issues/detail?id=490143
// https://github.com/electron/electron/issues/7212
window.testOfflineMode = function () {
  console.log('Test, going OFFLINE');
  client = window.client = new WebTorrent({
    peerId: PEER_ID,
    tracker: false,
    dht: false,
    webSeeds: false,
  });
  listenToClientEvents();
};

// For debugging
window.wtClient = client;

function reset() {
  console.log('reset');
  if (!client || !client.torrents.length) {
    ipc.send('wt-reset-ok');
    return;
  }
  if (client.torrents.length) {
    Promise.all(client.torrents.map(t => ({
      then: (res) => {
        t.destroy(() => { /* err ? rej(err) : res(); */
          res();
        });
      },
    }))).then(() => ipc.send('wt-reset-ok'));
  }
}

ipc.on(UNAUTHORIZED, reset);

// Manual reset for dev
window.reset = reset;
