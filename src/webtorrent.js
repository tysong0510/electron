/**
 * Entry point for Renderer process of WebTorrent page
 */

// To keep the UI snappy, we run WebTorrent in its own hidden window, a separate
// process from the main window.
import ExtendableError from "es6-error";
import Axios from "axios";
import store from "./store";
import { USER } from "./store/modules/auth";
import { AUTHORIZED, UNAUTHORIZED } from "./dispatch-types";
import { ADD_TORRENT_SEED } from "./store/mutation-types";
import { GAME_DOWNLOAD_PATH, TORRENTS_PATH } from "./store/modules/path";

console.time("init");

const crypto = require("crypto");
const deepEqual = require("deep-equal");
const electron = require("electron");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const WebTorrent = require("webtorrent");

const config = require("./config");

// const defaultAnnounceList = config.TRACKER_ANNOUNCE_LIST; // require('create-torrent').announceList
const defaultAnnounceList = require("create-torrent").announceList;
const pieceLength = config.PIECE_LENGTH;

class TorrentError extends ExtendableError {}

class TorrentKeyNotFoundError extends TorrentError {
  constructor(torrentKey) {
    super(`Can't resolve torrent key ${torrentKey}`);
  }
}

// Send & receive messages from the main window
const ipc = electron.ipcRenderer;

// Force use of webtorrent trackers on all torrents
global.WEBTORRENT_ANNOUNCE = defaultAnnounceList
  .map(arr => arr[0])
  .filter(url => url.indexOf("wss://") === 0 || url.indexOf("ws://") === 0 || url.indexOf("upd://") === 0);
/**
 * WebTorrent version.
 */
// const VERSION = require('../package.json').version

/**
 * Version prefix string (used in peer ID). WebTorrent uses the Azureus-style
 * encoding: '-', two characters for client id ('WW'), four ascii digits for version
 * number, '-', followed by random numbers.
 * For example:
 *   '-WW0102-'...
 */
const VERSION_PREFIX = "-WD" + "0000" /* VERSION_STR */ + "-";

/**
 * Generate an ephemeral peer ID each time.
 */
const PEER_ID = Buffer.from(VERSION_PREFIX + crypto.randomBytes(9).toString("base64"));

// Temporary remove function window.requestIdleCallback for force torrent downloading
window.requestIdleCallback = void 0;
// Connect to the WebTorrent and BitTorrent networks. WebTorrent Desktop is a hybrid
// client, as explained here: https://webtorrent.io/faq
// let client = (window.client = new WebTorrent({
//   peerId: PEER_ID,
//   tracker: {
//     rtcConfig: {
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
//         { url: "stun:stun01.sipphone.com" },
//         { url: "stun:stun.ekiga.net" },
//         { url: "stun:stun.fwdnet.net" },
//         { url: "stun:stun.ideasip.com" },
//         { url: "stun:stun.iptel.org" },
//         { url: "stun:stun.rixtelecom.se" },
//         { url: "stun:stun.schlund.de" },
//         { url: "stun:stun1.l.google.com:19302" },
//         { url: "stun:stun2.l.google.com:19302" },
//         { url: "stun:stun3.l.google.com:19302" },
//         { url: "stun:stun4.l.google.com:19302" },
//         { url: "stun:stunserver.org" },
//         { url: "stun:stun.softjoys.com" },
//         { url: "stun:stun.voiparound.com" },
//         { url: "stun:stun.voipbuster.com" },
//         { url: "stun:stun.voipstunt.com" },
//         { url: "stun:stun.voxgratia.org" },
//         { url: "stun:stun.xten.com" },
//         {
//           url: "turn:numb.viagenie.ca",
//           credential: "muazkh",
//           username: "webrtc@live.com"
//         },
//         {
//           url: "turn:192.158.29.39:3478?transport=udp",
//           credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
//           username: "28224511:1379330808"
//         },
//         {
//           url: "turn:192.158.29.39:3478?transport=tcp",
//           credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
//           username: "28224511:1379330808"
//         }
//       ]
//     }
//   },
//   dht: false,
//   torrentPort: 8000
//   // iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478?transport=udp"}]
// }));

let client = (window.client = new WebTorrent({ peerId: PEER_ID }));

function setPeerId() {
  const newPeerIdBuffer = Buffer.from(store.getters[USER].peerId);

  client.peerIdBuffer = newPeerIdBuffer;
  client.peerId = newPeerIdBuffer.toString("hex");

  ipc.once(UNAUTHORIZED, () => {
    ipc.once(AUTHORIZED, setPeerId);
  });
}

ipc.once(AUTHORIZED, setPeerId);

// Used for diffing, so we only send progress updates when necessary
let prevProgress = null;

init();

function init() {
  listenToClientEvents();
  //console.log("right above start torrenting in function init from webtorrent.js");
  ipc.on("wt-start-torrenting", (e, torrentKey, torrentID, path, fileModtimes, selections) => {
    // console.log(e, torrentKey, torrentID, path, fileModtimes, selections);
    startTorrenting(torrentKey, torrentID, path, fileModtimes, selections);
  });

  ipc.on("wt-stop-torrenting", (e, infoHash) => stopTorrenting(infoHash));
  ipc.on("wt-create-torrent", (e, torrentKey, options) => createTorrent(torrentKey, options));
  ipc.on("wt-save-torrent-file", (e, torrentKey) => saveTorrentFile(torrentKey));
  ipc.on("wt-select-files", (e, infoHash, selections) => selectFiles(infoHash, selections));

  ipc.on("wt-reset", () => reset());

  ipc.send("ipcReadyWebTorrent");

  window.addEventListener(
    "error",
    e =>
      ipc.send("wt-uncaught-error", {
        message: e.error ? e.error.message : String(e),
        stack: e.error ? e.error.stack : void 0
      }),
    true
  );

  setInterval(updateTorrentProgress, 1000);
  console.timeEnd("init");
}

function listenToClientEvents() {
  client.on("warning", err => {
    console.warn(err.message);
    ipc.send("wt-warning", null, err.message);
  });
  client.on("error", err => {
    console.log("inside client on for error in webtorrent.js");
    console.error(err.message);
    ipc.send("wt-error", null, err);
  });
  // client.on("seed", torrent => {
  //   console.log("seed", torrent);
  // });
}

// Starts a given TorrentID, which can be an infohash, magnet URI, etc.
// Returns a WebTorrent object. See https://git.io/vik9M
function startTorrenting(torrentKey, torrentID, path, fileModtimes, selections) {
  //downloading a torrent
  const torrent = client.add(torrentID, {
    path,
    fileModtimes
    //announce: "wss://tracker.webtorrent.io"
  });
  torrent.key = torrentKey;
  // Listen for ready event, progress notifications, etc
  addTorrentEvents(torrent);
  // Only download the files the user wants, not necessarily all files
  torrent.once("ready", () => selectFiles(torrent, selections));
}

function stopTorrenting(infoHash) {
  const torrent = client.get(infoHash);
  if (torrent) torrent.destroy();
}

// Create a new torrent, start seeding
function createTorrent(torrentKey, options = {}) {
  const fsExtra = require("fs-extra");
  const gameDownloadPath = store.getters[GAME_DOWNLOAD_PATH](options.gameId);

  fsExtra.emptyDirSync(gameDownloadPath);

  const paths = options.files.map(f => f.path);
  const files = [];

  paths.forEach(filePath => {
    const newPath = path.join(gameDownloadPath, path.basename(filePath));
    files.push(newPath);
    fs.copyFileSync(filePath, newPath);
  });

  // Force private
  options.private = true;
  options.announceList = defaultAnnounceList;
  options.pieceLength = pieceLength;
  options.path = gameDownloadPath;
  console.log("START SEEDING");

  //sharing a torrent to be downloaded
  const torrent = client.seed(files, options);
  torrent.key = torrentKey;
  addTorrentEvents(torrent); //would it contact application in this method...
  ipc.send("wt-new-torrent");

  torrent.once("ready", function() {
    // saveTorrentFile(torrentKey);
    store.dispatch({
      type: ADD_TORRENT_SEED,
      payload: {
        gameId: options.gameId,
        state: "seeding",
        infoHash: torrent.infoHash,
        torrentURL: torrent.magnetURI,
        torrentKey: torrent.key,
        sizeBytes: torrent.length,
        path: torrent.path
      }
    });
  });
}

function addTorrentEvents(torrent) {
  let downloadedPieces = [];
  console.log(torrent);
  console.log("torrent key: " + torrent.key);
  let t = store.getters.findTorrentByKey(torrent.key);
  console.log(t);
  let gameId = t && t.gameId;
  const userId = store.getters[USER].id;

  torrent.on("download", bytes => {
    console.log("torrent download bytes:", bytes);

    if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length >= 24) {
      Axios({ url: "/user-game-download-blocks/group", data: downloadedPieces, method: "POST" })
        .then(res => {
          console.log("wire download add group done", res);
        })
        .catch(err => {
          console.log("wire download add group error:", err, err.request);
          if (err.request && Array.isArray(err.request.data)) {
            downloadedPieces.concat(err.request.data);
          }
        });

      downloadedPieces = [];
    }
  });

  torrent.on("upload", bytes => {
    console.log("torrent upload bytes:", bytes);
  });

  torrent.on("warning", err => ipc.send("wt-warning", torrent.key, err.message));
  torrent.on("error", err => ipc.send("wt-error", torrent.key, err.message));
  torrent.on("infoHash", () => ipc.send("wt-infohash", torrent.key, torrent.infoHash));
  torrent.on("metadata", torrentMetadata);
  torrent.on("ready", torrentReady);
  torrent.on("done", () => {
    console.log("torrent done");
    console.log("inside torrent done event...");

    if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length) {
      Axios({ url: "/user-game-download-blocks/group", data: downloadedPieces, method: "POST" })
        .then(res => {
          console.log("wire download add group done", res);
        })
        .catch(err => {
          console.log("wire download add group error:", err, err.request);
        });

      downloadedPieces = [];
    }

    torrentDone();
  });
  torrent.on("peer", peer => {
    console.log("new peer", peer);
  });
  torrent.on("wire", (wire, addr) => {
    // const origRequest = wire.request;
    // wire.request = function(pieceIndex, offset, length, cb) {
    //   console.log(this, pieceIndex, offset, length, cb);
    //   if (this._finished) {
    //     console.log("Finished");
    //   }
    //
    //   if (this.peerChoking) {
    //     console.log("peerChoking");
    //   }
    //
    //   origRequest.apply(this, [
    //     pieceIndex,
    //     offset,
    //     length,
    //     (err, block) => {
    //       console.log(err, block);
    //       cb(err, block);
    //     }
    //   ]);
    // };
    console.log("wire peerId utf-8 string", Buffer.from(wire.peerId, "hex").toString("utf-8"));

    console.log("wire", wire);

    if (!t && !gameId) {
      t = store.getters.findTorrentByKey(torrent.key);
      gameId = t && t.gameId;
    }

    console.log(`connected to remote peer with ID ${wire.peerId} and address ${addr}, torrenting game ${gameId}`);
    console.log("torrent", torrent);

    wire.on("close", () => {
      console.log("wire closed. Send stats to server");
      console.log("downloaded pieces below");
      console.log(downloadedPieces);

      if (downloadedPieces && Array.isArray(downloadedPieces) && downloadedPieces.length) {
        console.log("above axios to send stats to server...");
        Axios({ url: "/user-game-download-blocks/group", data: downloadedPieces, method: "POST" })
          .then(res => {
            console.log("wire download add group done", res);
          })
          .catch(err => {
            console.log("wire download add group error:", err, err.request);
          });

        downloadedPieces = [];
      }
      console.log("did not make it into if case to send stats to server");
    });

    ipc.send("wt-wire-connect", torrent.key, addr);

    wire.on("interested", () => {
      console.log(`peer ${addr} is now interested in ${wire.peerInterested ? "us" : ""}`);
    });

    wire.on("piece", (index, offset, buffer) => {
      const downloadedBlock = {
        blockOffset: index * torrent.pieceLength + offset,
        blockLength: buffer.length,
        gameId,
        peerId: Buffer.from(wire.peerId, "hex").toString("utf-8"),
        userId,
        autoFix: false
      };

      if (!downloadedPieces) {
        downloadedPieces = [];
      }

      downloadedPieces.push(downloadedBlock);
    });

    wire.on("uninterested", () => {
      console.log(`peer ${addr} is no longer interested`);
    });

    wire.on("handshake", (infoHash, peerId, extensions) => {
      console.log("wire handshake", { infoHash, peerId, extensions });
    });

    wire.on("choke", () => {
      console.log("peer is now choking us");
    });

    wire.on("unchoke", () => {
      console.log("peer unchoked us");
    });

    wire.on("request", (pieceIndex, offset, length) => {
      console.log("wire request", { pieceIndex, offset, length });
    });

    wire.on("have", index => {
      console.log(`wire have ${index}`);
    });

    wire.on("timeout", () => {
      console.log(`wire timeout ${wire.addr}. Destroy...`);
    });

    // wire.on('bitfield', (wire, bitfield) => {
    //   console.log(`bitfield received from the peer with ID ${wire.peerId}: ${bitfield}`);
    // });
    wire.on("download", () => {});

    wire.on("upload", () => {});
  });
  torrent.on("noPeers", announceType => {
    console.log(`noPeers after announceType=${announceType}`);
    ipc.send("wt-no-peers", torrent.key, announceType);
  });

  function torrentMetadata() {
    const info = getTorrentInfo(torrent);
    ipc.send("wt-metadata", torrent.key, info);
    console.log("torrentMetadata", info);

    updateTorrentProgress();
  }

  function torrentReady() {
    console.log("inside function torrentReady, outputting torrent below...");
    console.log(torrent);
    const info = getTorrentInfo(torrent);
    console.log("torrentReady", info);
    ipc.send("wt-ready", torrent.key, info);
    ipc.send(`wt-ready-${torrent.infoHash}`, torrent.key, info);

    updateTorrentProgress();
  }

  function torrentDone() {
    const info = getTorrentInfo(torrent);
    console.log("torrentDone", info);
    ipc.send("wt-done", torrent.key, info);

    updateTorrentProgress();

    torrent.getFileModtimes((err, fileModtimes) => {
      if (err) return onError(err);
      ipc.send("wt-file-modtimes", torrent.key, fileModtimes);
    });
  }
}

// Produces a JSON saveable summary of a torrent
function getTorrentInfo(torrent) {
  console.log("getTorrentInfo", torrent);
  return {
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    name: torrent.name,
    path: torrent.path,
    files: torrent.files.map(getTorrentFileInfo),
    bytesReceived: torrent.received
  };
}

// Produces a JSON saveable summary of a file in a torrent
function getTorrentFileInfo(file) {
  console.log("getTorrentFileInfo", file);
  return {
    name: file.name,
    length: file.length,
    path: file.path
  };
}

// Every time we resolve a magnet URI, save the torrent file so that we can use
// it on next startup. Starting with the full torrent metadata will be faster
// than re-fetching it from peers using ut_metadata.
function saveTorrentFile(torrentKey) {
  console.log("saveTorrentFile", torrentKey);
  const torrent = getTorrent(torrentKey);
  const torrentsUserDir = store.getters[TORRENTS_PATH];
  if (!fs.existsSync(torrentsUserDir)) fs.mkdirSync(torrentsUserDir, { recursive: true });

  const fileName = `${torrent.infoHash}.torrent`;
  const torrentPath = path.join(torrentsUserDir, fileName);
  fs.access(torrentPath, fs.constants.R_OK, err => {
    if (!err) {
      // We've already saved the file
      return ipc.send("wt-file-saved", torrentKey, torrentPath);
    }

    mkdirp(torrentsUserDir, () => {
      fs.writeFile(torrentPath, torrent.torrentFile, err => {
        if (err) return console.log("error saving torrent file %s: %o", torrentPath, err);
        console.log("saved torrent file %s", torrentPath);
        return ipc.send("wt-file-saved", torrentKey, torrentPath);
      });
    });
  });
}

function updateTorrentProgress() {
  //console.log("inside updateTorrent Progress");
  const progress = getTorrentProgress();
  // console.log("outputting progress object below...");
  // console.log(progress);
  //console.log("gor progress from getTorrentProgress");
  // TODO: diff torrent-by-torrent, not once for the whole update
  if (prevProgress && deepEqual(progress, prevProgress, { strict: true })) {
    return; /* don't send heavy object if it hasn't changed */
  }
  ipc.send("wt-progress", progress);
  prevProgress = progress;
}

function getTorrentProgress() {
  // First, track overall progress
  const { progress } = client;
  const hasActiveTorrents = client.torrents.some(torrent => torrent.progress !== 1);

  // Track progress for every file in each torrent
  // TODO: ideally this would be tracked by WebTorrent, which could do it
  // more efficiently than looping over torrent.bitfield
  const torrentProg = client.torrents.map(torrent => {
    const fileProg =
      torrent.files &&
      torrent.files.map(file => {
        const numPieces = file._endPiece - file._startPiece + 1;
        let numPiecesPresent = 0;
        for (let piece = file._startPiece; piece <= file._endPiece; piece++) {
          if (torrent.bitfield.get(piece)) numPiecesPresent++;
        }
        return {
          startPiece: file._startPiece,
          endPiece: file._endPiece,
          numPieces,
          numPiecesPresent
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
      files: fileProg
    };
  });

  return {
    torrents: torrentProg,
    progress,
    hasActiveTorrents
  };
}

function selectFiles(torrentOrInfoHash, selections) {
  // Get the torrent object
  console.log("inside selectFiles");
  let torrent;
  if (typeof torrentOrInfoHash === "string") {
    console.log("torrent is of type string... in selected files");
    torrent = client.get(torrentOrInfoHash);
  } else {
    console.log("torrent is not of type string in selected files...");
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
    console.log("selections below...in selectFiles");
    selections = torrent.files.map(() => true);
    console.log(selections);
  }

  // Selections specified incorrectly?
  if (selections.length !== torrent.files.length) {
    throw new Error(`got ${selections.length} file selections, ` + `but the torrent contains ${torrent.files.length} files`);
  }

  // Remove default selection (whole torrent)
  torrent.deselect(0, torrent.pieces.length - 1, false);

  // Add selections (individual files)
  for (let i = 0; i < selections.length; i++) {
    const file = torrent.files[i];
    if (selections[i]) {
      file.select(); //selects an individual file if it is there
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
window.testOfflineMode = function() {
  console.log("Test, going OFFLINE");
  client = window.client = new WebTorrent({
    peerId: PEER_ID,
    tracker: false,
    dht: false,
    webSeeds: false
  });
  listenToClientEvents();
};

// For debugging
window.wtClient = client;

function reset() {
  if (!client || !client.torrents.length) {
    ipc.send("wt-reset-ok");
    return;
  }
  if (client.torrents.length) {
    Promise.all(
      client.torrents.map(t => ({
        then: res => {
          t.destroy(() => {
            /* err ? rej(err) : res(); */
            res();
          });
        }
      }))
    ).then(() => ipc.send("wt-reset-ok"));
  }
}

ipc.on(UNAUTHORIZED, reset);

// Manual reset for dev
window.reset = reset;
