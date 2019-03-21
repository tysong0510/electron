import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import { webtorrent } from './background/windows';
import { State } from './state';
import { STATE_SAVE_IMMEDIATE, UNCAUGHT_ERROR } from './dispatch-types';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, torrentWin;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 992,
    height: 640,
    minWidth: 992,
    minHeight: 640,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: 'detach' });
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

function delayedInit () {
  if (app.isQuitting) return

  // const announcement = require('./announcement')
  // const dock = require('./dock')
  // const updater = require('./updater')
  // const FolderWatcher = require('./folder-watcher')
  // const folderWatcher = new FolderWatcher({ window: windows.main, state })

  // announcement.init()
  // dock.init()
  // updater.init()

  // ipc.setModule('folderWatcher', folderWatcher)
  // if (folderWatcher.isEnabled()) {
  //   folderWatcher.start()
  // }

  // if (process.platform === 'win32') {
  //   const userTasks = require('./user-tasks')
  //   userTasks.init()
  // }

  // if (process.platform !== 'darwin') {
  //   const tray = require('./tray')
  //   tray.init()
  // }
}

async function init() {
  let isReady = false // app ready, windows can be created
  app.ipcReady = false // main window has finished loading and IPC is ready
  app.isQuitting = false

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    } else if (isReady) {
      win.show();
    }
  });

  app.on('before-quit', function (e) {
    if (app.isQuitting) return

    app.isQuitting = true
    e.preventDefault()
    if (win) {
      win.send('dispatch', STATE_SAVE_IMMEDIATE) // try to save state on exit
      ipcMain.once('stateSaved', () => app.quit())
      setTimeout(() => {
        console.error('Saving state took too long. Quitting.')
        app.quit()
      }, 4000) // quit after 4 secs, at most
    }
  })

  const [, appState] = await Promise.all([
    { then: res => app.on('ready', () => res()) },
    State.load()
  ]);
  isReady = true;

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  createWindow(appState);
  torrentWin = webtorrent.getInstance();

  // To keep app startup fast, some code is delayed.
  setTimeout(() => {
    delayedInit({})
  }, 3000);

  // Report uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(err)
    const error = {
      message: err.message,
      stack: err.stack
    }
    if (win) {
      win.send('dispatch', UNCAUGHT_ERROR, 'main', error);
    }
  });
}

init();

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

const ipc = ipcMain;
// Messages from the main process, to be sent once the WebTorrent process starts
const messageQueueMainToWebTorrent = []

ipc.once('ipcReady', function () {
  app.ipcReady = true
  app.emit('ipcReady')
})

ipc.once('ipcReadyWebTorrent', function () {
  app.ipcReadyWebTorrent = true
  console.log('sending %d queued messages from the main win to the webtorrent window',
    messageQueueMainToWebTorrent.length)
  messageQueueMainToWebTorrent.forEach(function (message) {
    var ref;

    (ref = torrentWin).send.apply(ref, [ message.name ].concat( message.args ))
    console.log('webtorrent: sent queued %s', message.name)
  })
})

/**
 * Message proxying
 */
const oldEmit = ipc.emit
ipc.emit = function (name, e) {
  var ref, ref$1;

  var args = [], len = arguments.length - 2;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
  // Relay messages between the main window and the WebTorrent hidden window
  if (name.startsWith('wt-') && !app.isQuitting) {
    if (e.sender.browserWindowOptions.title === 'webtorrent-hidden-window') {
      // Send message to main window
      (ref = win).send.apply(ref, [ name ].concat( args ))
      console.log('webtorrent: got %s', name)
    } else if (app.ipcReadyWebTorrent) {
      // Send message to webtorrent window
      (ref$1 = torrentWin).send.apply(ref$1, [ name ].concat( args ))
      console.log('webtorrent: sent %s', name)
    } else {
      // Queue message for webtorrent window, it hasn't finished loading yet
      messageQueueMainToWebTorrent.push({
        name: name,
        args: args
      })
      console.log('webtorrent: queueing %s', name)
    }
    return
  }

  // Emit all other events normally
  oldEmit.call.apply(oldEmit, [ ipc, name, e ].concat( args ))
}
