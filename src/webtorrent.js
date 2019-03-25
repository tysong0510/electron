/**
 * Entry point for Renderer process of WebTorrent page
 */

// To keep the UI snappy, we run WebTorrent in its own hidden window, a separate
// process from the main window.
console.time('init')

const crypto = require('crypto')
const deepEqual = require('deep-equal')
const electron = require('electron')
const fs = require('fs')
const mkdirp = require('mkdirp')
// const networkAddress = require('network-address')
const path = require('path')
const WebTorrent = require('webtorrent')
import ExtendableError from 'es6-error';

const unzip = require('extract-zip')

// const crashReporter = require('../crash-reporter')
const config = require('./config')
const defaultAnnounceList = config.TRACKER_ANNOUNCE_LIST // require('create-torrent').announceList

class TorrentError extends ExtendableError {
}

class TorrentKeyNotFoundError extends TorrentError {
  constructor(torrentKey) {
    super(`Can't resolve torrent key ${torrentKey}`)
  }
}

// const torrentPoster = require('./lib/torrent-poster')

// Report when the process crashes
// crashReporter.init()

// Send & receive messages from the main window
const ipc = electron.ipcRenderer

// Force use of webtorrent trackers on all torrents
global.WEBTORRENT_ANNOUNCE = defaultAnnounceList
  .map((arr) => arr[0])
  .filter((url) => url.indexOf('wss://') === 0 || url.indexOf('ws://') === 0)

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
const VERSION_PREFIX = '-WD' + '0000' /* VERSION_STR */ + '-'

/**
 * Generate an ephemeral peer ID each time.
 */
const PEER_ID = Buffer.from(VERSION_PREFIX + crypto.randomBytes(9).toString('base64'))

// Connect to the WebTorrent and BitTorrent networks. WebTorrent Desktop is a hybrid
// client, as explained here: https://webtorrent.io/faq
let client = window.client = new WebTorrent({
  peerId: PEER_ID,
  dht: false,
  // iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478?transport=udp"}]
})

// Used for diffing, so we only send progress updates when necessary
let prevProgress = null

const {app, remote} = electron;
const userDataPath = (app || remote.app).getPath('userData');
// const downloadPath = path.join(userDataPath, 'downloads');
const installPath = path.join(userDataPath, 'apps');

init()

function init() {
  listenToClientEvents()

  ipc.on('wt-start-torrenting', (e, torrentKey, torrentID, path, fileModtimes, selections) =>
    startTorrenting(torrentKey, torrentID, path, fileModtimes, selections))
  ipc.on('wt-stop-torrenting', (e, infoHash) =>
    stopTorrenting(infoHash))
  ipc.on('wt-create-torrent', (e, torrentKey, options) =>
    createTorrent(torrentKey, options))
  ipc.on('wt-save-torrent-file', (e, torrentKey) =>
    saveTorrentFile(torrentKey))
  ipc.on('wt-select-files', (e, infoHash, selections) =>
    selectFiles(infoHash, selections))

  ipc.on('wt-reset', () => reset());

  ipc.send('ipcReadyWebTorrent')

  window.addEventListener('error', (e) =>
      ipc.send('wt-uncaught-error', {
        message: e.error ? e.error.message : String(e),
        stack: e.error ? e.error.stack : void 0
      }),
    true)

  setInterval(updateTorrentProgress, 1000)
  console.timeEnd('init')
}

function listenToClientEvents () {
  client.on('warning', (err) => {
    console.warn(err.message);
    ipc.send('wt-warning', null, err.message)
  });
  client.on('error', (err) => {
    console.error(err.message);
    ipc.send('wt-error', null, err.message)
  });
}

// Starts a given TorrentID, which can be an infohash, magnet URI, etc.
// Returns a WebTorrent object. See https://git.io/vik9M
function startTorrenting(torrentKey, torrentID, path, fileModtimes, selections) {
  console.log('starting torrent %s: %s', torrentKey, torrentID)

  const torrent = client.add(torrentID, {
    path: path,
    fileModtimes: fileModtimes,
    // announce: 'wss://tracker.webtorrent.io'
  })
  torrent.key = torrentKey

  // Listen for ready event, progress notifications, etc
  addTorrentEvents(torrent)

  // Only download the files the user wants, not necessarily all files
  torrent.once('ready', () => selectFiles(torrent, selections))
}

function stopTorrenting(infoHash) {
  console.log('--- STOP TORRENTING: ', infoHash)
  const torrent = client.get(infoHash)
  if (torrent) torrent.destroy()
}

// Create a new torrent, start seeding
function createTorrent(torrentKey, options = {}) {
  console.log('creating torrent', torrentKey, options)
  const paths = options.files.map((f) => f.path)
  // Force private
  options.private = true;
  const torrent = client.seed(paths, options)
  torrent.key = torrentKey
  addTorrentEvents(torrent)
  ipc.send('wt-new-torrent')
}

function addTorrentEvents(torrent) {
  torrent.on('warning', (err) =>
    ipc.send('wt-warning', torrent.key, err.message))
  torrent.on('error', (err) =>
    ipc.send('wt-error', torrent.key, err.message))
  torrent.on('infoHash', () =>
    ipc.send('wt-infohash', torrent.key, torrent.infoHash))
  torrent.on('metadata', torrentMetadata)
  torrent.on('ready', torrentReady)
  torrent.on('done', torrentDone)
  torrent.on('wire', (wire, addr) => {
    console.log('connected to peer with address ' + addr)
    ipc.send('wt-wire-connect', torrent.key, addr);

    wire.on('handshake', (infoHash, peerId, extensions) => {
      console.log('wire handshake', {infoHash, peerId, extensions});
    });
    wire.on('choke', () => {
      console.log('peer is now choking us');
    });
    wire.on('unchoke', () => {
      console.log('peer unchoked us');
    });
    wire.on('request', (pieceIndex, offset, length) => {
      console.log('wire request', {pieceIndex, offset, length});
    });

  });
  torrent.on('noPeers', (announceType) => {
    console.log(`noPeers after announceType=${announceType}`);
    ipc.send('wt-no-peers', torrent.key, announceType);
  });

  function torrentMetadata() {
    const info = getTorrentInfo(torrent)
    ipc.send('wt-metadata', torrent.key, info)

    updateTorrentProgress()
  }

  function torrentReady() {
    const info = getTorrentInfo(torrent)
    ipc.send('wt-ready', torrent.key, info)
    ipc.send('wt-ready-' + torrent.infoHash, torrent.key, info)

    updateTorrentProgress()
  }

  function torrentDone() {
    const info = getTorrentInfo(torrent)
    ipc.send('wt-done', torrent.key, info)

    updateTorrentProgress()

    torrent.getFileModtimes(function (err, fileModtimes) {
      if (err) return onError(err)
      ipc.send('wt-file-modtimes', torrent.key, fileModtimes)
    })
    torrent.files.forEach(function (file) {
      if (/\.zip$/.test(file.name)) {
        const gameInstallPath = path.join(installPath, `${torrent.key}`);
        const gameDownloadPath = path.join(torrent.path, file.name);

        console.log("GAME install PATH ", gameInstallPath)
        console.log("GAME download PATH ", gameDownloadPath)

        unzip(gameDownloadPath, {
          dir: gameInstallPath
        }, function (err) {
          console.log('Error', err);
        })
      }
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
    bytesReceived: torrent.received
  }
}

// Produces a JSON saveable summary of a file in a torrent
function getTorrentFileInfo(file) {
  return {
    name: file.name,
    length: file.length,
    path: file.path
  }
}

// Every time we resolve a magnet URI, save the torrent file so that we can use
// it on next startup. Starting with the full torrent metadata will be faster
// than re-fetching it from peers using ut_metadata.
function saveTorrentFile(torrentKey) {
  const torrent = getTorrent(torrentKey)
  const torrentsDir = path.join(
    (electron.app || electron.remote.app).getPath('userData'),
    'torrents'); //config.TORRENT_PATH,
  const torrentPath = path.join(torrentsDir,
    torrent.infoHash + '.torrent')

  fs.access(torrentPath, fs.constants.R_OK, function (err) {
    const fileName = torrent.infoHash + '.torrent'
    if (!err) {
      // We've already saved the file
      return ipc.send('wt-file-saved', torrentKey, fileName)
    }

    mkdirp(torrentsDir, function () {
      fs.writeFile(torrentPath, torrent.torrentFile, function (err) {
        if (err) return console.log('error saving torrent file %s: %o', torrentPath, err)
        console.log('saved torrent file %s', torrentPath)
        return ipc.send('wt-file-saved', torrentKey, fileName)
      })
    });
  })
}

function updateTorrentProgress() {
  const progress = getTorrentProgress()
  // TODO: diff torrent-by-torrent, not once for the whole update
  if (prevProgress && deepEqual(progress, prevProgress, {strict: true})) {
    return /* don't send heavy object if it hasn't changed */
  }
  ipc.send('wt-progress', progress)
  prevProgress = progress
}

function getTorrentProgress() {
  // First, track overall progress
  const progress = client.progress
  const hasActiveTorrents = client.torrents.some(function (torrent) {
    return torrent.progress !== 1
  })

  // Track progress for every file in each torrent
  // TODO: ideally this would be tracked by WebTorrent, which could do it
  // more efficiently than looping over torrent.bitfield
  const torrentProg = client.torrents.map(function (torrent) {
    const fileProg = torrent.files && torrent.files.map(function (file) {
      const numPieces = file._endPiece - file._startPiece + 1
      let numPiecesPresent = 0
      for (let piece = file._startPiece; piece <= file._endPiece; piece++) {
        if (torrent.bitfield.get(piece)) numPiecesPresent++
      }
      return {
        startPiece: file._startPiece,
        endPiece: file._endPiece,
        numPieces,
        numPiecesPresent
      }
    })
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
    }
  })

  return {
    torrents: torrentProg,
    progress,
    hasActiveTorrents
  }
}

console.log('Initializing...')

function selectFiles(torrentOrInfoHash, selections) {
  // Get the torrent object
  let torrent
  if (typeof torrentOrInfoHash === 'string') {
    torrent = client.get(torrentOrInfoHash)
  } else {
    torrent = torrentOrInfoHash
  }
  if (!torrent) {
    throw new Error('selectFiles: missing torrent ' + torrentOrInfoHash)
  }

  // Selections not specified?
  // Load all files. We still need to replace the default whole-torrent
  // selection with individual selections for each file, so we can
  // select/deselect files later on
  if (!selections) {
    selections = torrent.files.map(() => true)
  }

  // Selections specified incorrectly?
  if (selections.length !== torrent.files.length) {
    throw new Error('got ' + selections.length + ' file selections, ' +
      'but the torrent contains ' + torrent.files.length + ' files')
  }

  // Remove default selection (whole torrent)
  torrent.deselect(0, torrent.pieces.length - 1, false)

  // Add selections (individual files)
  for (let i = 0; i < selections.length; i++) {
    const file = torrent.files[i]
    if (selections[i]) {
      file.select()
    } else {
      console.log('deselecting file ' + i + ' of torrent ' + torrent.name)
      file.deselect()
    }
  }
}

// Gets a WebTorrent handle by torrentKey
// Throws an Error if we're not currently torrenting anything w/ that key
function getTorrent(torrentKey) {
  const ret = client.torrents.find((x) => x.key === torrentKey)
  if (!ret) throw new TorrentKeyNotFoundError(torrentKey)
  return ret
}

function onError(err) {
  console.log(err)
}

// TODO: remove this once the following bugs are fixed:
// https://bugs.chromium.org/p/chromium/issues/detail?id=490143
// https://github.com/electron/electron/issues/7212
window.testOfflineMode = function () {
  console.log('Test, going OFFLINE')
  client = window.client = new WebTorrent({
    peerId: PEER_ID,
    tracker: false,
    dht: false,
    webSeeds: false,
  })
  listenToClientEvents()
}

// For debugging
window.wtClient = client;
// Download torrent and seed it

// ipc.on('wt-');

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
      }
    }))).then(() => ipc.send('wt-reset-ok'));
  }
}

// Manual reset for dev
window.reset = reset;
