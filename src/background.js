/* global __static */

import path from "path";
import fs from "fs";
import { app, BrowserWindow, ipcMain, protocol } from "electron";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";

import { webtorrent } from "./background/windows";
import { State } from "./state";
import {
  AUTHORIZED,
  DRM_MODE_DECRYPT,
  DRM_MODE_ENCRYPT,
  STATE_SAVE_IMMEDIATE,
  UNAUTHORIZED,
  UNCAUGHT_ERROR,
  UNZIP_GAME
} from "./dispatch-types";
import store from "./store";
import { ACTION_REFRESH } from "./store/modules/auth";
import { INSTALL_PATH } from "./store/modules/path";
import { UNARCHIVE_FAIL, UNARCHIVE_OK } from "./store/mutation-types";
import fsExtra from "fs-extra";
import { baseURL } from "./apiConfig";

const { autoUpdater } = require("electron-updater");
autoUpdater.autoDownload = false; //should resolve issue of ENOENT, as this arises from being called so many times
autoUpdater.logger = require("electron-log");
const { dialog } = require("electron");
// const downloadPath = store.getters[GAME_DOWNLOAD_PATH];
// const installPath = store.getters[INSTALL_PATH];

const isDevelopment = process.env.NODE_ENV !== "production";
const enableDebug = process.env.DEBUG === "true" || process.argv.includes("--debug");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let torrentWin;
var userToken;
let deeplinkingUrl = null;

/*const shouldQuit = app.makeSingleInstance(argv => {
  if (process.platform == "win32") {
    deeplinkingUrl = argv.slice(1);
  }
  logEverywhere("app.makeSingleInstance#" + deeplinkingUrl);

  if(win) {
    if(win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
});

if(shouldQuit) {
  app.quit();
}*/

// Standard scheme must be registered before the app is ready
//protocol.registerStandardSchemes(["app"], { secure: true });
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: { standard: true, secure: true, supportFetchAPI: true }
  }
]);

function createWindow({ debug }) {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1144,
    height: 720,
    minWidth: 1144,
    minHeight: 720,
    icon: path.join(__static, "icon.png"),
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: "detach" });
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html"); // this loads the original page
    if (!isDevelopment || enableDebug || debug) {
      win.webContents.openDevTools({ mode: "detach" });
    }
  }

  if (process.platform == "win32") {
    //dialog.showErrorBox("Title", "inside where i should be");
    deeplinkingUrl = process.argv.slice(1);
    //dialog.showErrorBox("deepLinkingURL", deeplinkingUrl);
    if (deeplinkingUrl != null) {
      //if app is openend by URL
      //dialog.showErrorBox("URL", "app was opened by external link")
      var str = deeplinkingUrl[0];

      var index = 9;
      if (index + 1 > str.length) {
        //dialog.showErrorBox("Error", "There was no username present...");
      } else {
        var username = "";

        for (var i = index; i < str.length; i++) {
          username += str.charAt(i);
        }

        //need to check if there is a back slash at end of username, if so then remove it
        if (username.charAt(username.length - 1) == "/") {
          username = username.substring(0, username.length - 1);
        }

        // dialog.showErrorBox("Username", "Value of username is: " + username);

        if (win) {
          setTimeout(() => {
            //dialog.showErrorBox("Delay", "Delay has just finished...");
            win.webContents.send("info", username);
          }, 12000);
        }
      }
    }
  }

  win.on("close", e => {
    if (process.platform !== "darwin") {
      console.log("quitting1");
      app.quit();
    }
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on("closed", () => {
    win = null;
  });
}

//Attempting to open a second window for windows
//app.requestSingleInstanceLock();
app.on("second-instance", (event, argv, cwd) => {
  /* ... */
  //dialog.showErrorBox("Second", "second instance here");
  console.log(cwd);
  if (process.platform == "win32") {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv; //could make deeplinkingURL = argv

    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }

    if (deeplinkingUrl.length > 0) {
      var str = deeplinkingUrl[9];

      var index = 9;
      if (index + 1 > str.length) {
        dialog.showErrorBox("Error", "There was no username present...");
      } else {
        var username = "";
        for (var i = index; i < str.length; i++) {
          username += str.charAt(i);
        }

        if (username.charAt(username.length - 1) == "/") {
          username = username.substring(0, username.length - 1);
        }

        if (win) {
          win.webContents.send("info", username);
        }
      }
    }
  }
});

ipcMain.on("open-new-window", (event, gameIDs, amount, recommenderID) => {
  //console.log(event);
  console.log("amount price is: " + amount);
  console.log("gameIds to be sent: ", gameIDs);
  console.log("base url is: ", baseURL);
  let win = new BrowserWindow({ width: 960, height: 540 });
  //win.loadURL(`https://www.voxpopgames.com/payment/buyGameByIds`, {
  //win.loadURL(`http://localhost:5000/payment/buyGameByIds`, {
  //win.loadURL(`http://voxpopapitestenviornment-env.eba-wkri97ms.us-east-2.elasticbeanstalk.com/payment/buyGameByIds`, {
  //win.loadURL(`https://www.voxpopgames.site/payment/buyGameByIds`, {
  //win.loadURL(`voxpopgames.site/payment/buyGameByIds`, {
  win.loadURL(baseURL + `payment/buyGameByIds`, {
    extraHeaders:
      "Authorization: " + userToken + "\n" + "amount: " + amount + "\n" + "token: " + gameIDs + "\n" + "recommender: " + recommenderID
  });
  //win.webContents.openDevTools({ mode: "detach" });
});

var link = null;
//var result = null;

app.setAsDefaultProtocolClient("voxpop");

app.on("open-url", (event, data) => {
  event.preventDefault();

  var index = 9;

  link = data;
  console.log("data from opening link: ", data);

  dialog.showErrorBox("open-url", "the data variable is: " + data);
  dialog.showErrorBox("open-url", "The link variable: " + link);

  if (index + 1 > link.length) {
    //output error message
    dialog.showErrorBox("open-url", "There is no username/game title attatched to this protocol, please try again");
  } else {
    var username = "";

    /**
     * This is for getting the recommended games to go to game details...
     */
    // var gameTitle = "";
    // var slashIndex = link.indexOf("/");

    // if (slashIndex > 0) {
    //   username = link.substring(index, slashIndex - 1);
    //   gameTitle = link.substring(slashIndex + 1, link.length - 1);
    // } else {
    //   username = link.substring(index, slashIndex - 1);
    //   gameTitle = null;
    // }
    for (var i = index; i < link.length; i++) {
      username += link.charAt(i);
    }
    dialog.showErrorBox("open-url", "The username retrieved was: " + username);
    //dialog.showErrorBox("GameTitle", "game title retrieved: ", gameTitle);

    if (win) {
      // var externalData =  {
      //   username: username,
      //   gameTitle: gameTitle
      // }

      // console.log("data to be sent is: ", externalData);
      win.webContents.send("info", username);
    }
  }

  // console.log("app path: ", app.getAppPath());

  console.log("link data: ", link);
  logEverywhere("open-url# " + data);

  //createProtocol("app");
});
//export default result;

//module.exports.getLink = () => link;

function logEverywhere(s) {
  console.log(s);
  if (win && win.webContents) {
    win.executeJavaScript(`console.log("${s}")`);
  }
}

/**
 * To check for an update once an application turns on, then the interval below should check again in its respected time
 *
 * Seems that when application initializes and checks for update, it may be causing issues.
 *
 * TODO: Test without below to see if issues arise or not
 */

// app.on("ready", () => {
//   if (!isDevelopment) {
//     autoUpdater.checkForUpdates();
//   }
// });

//   autoUpdater.checkForUpdates();

//   autoUpdater.on("checking-for-update", () => {
//     console.log("Checking for update event...");
//     dialog.showMessageBox({
//       title: "Updates",
//       message: "Checking for updates..."
//     });
//   });

//   autoUpdater.on("error", error => {
//     dialog.showErrorBox("Error: ", error == null ? "unknown" : (error.stack || error).toString());
//   });

//   autoUpdater.on("update-available", () => {
//     //autoUpdater.logger.transports.file.level = "info";
//     autoUpdater.logger.debug("inside update available");
//     dialog.showMessageBox(
//       {
//         type: "info",
//         title: "Update Found!",
//         message: "An update was found, would you like to download it and restart your application?",
//         buttons: ["Yes", "Later"]
//       },
//       buttonIndex => {
//         if (buttonIndex === 0) {
//           autoUpdater.downloadUpdate();
//         }
//       }
//     );
//   });

//   autoUpdater.on("update-downloaded", () => {
//     //Application kind of restarts with just autoUpdater.quitAndInstall(), but had developer tools open, see if it will close out developer tools with this...
//     // if (win) {
//     //   win.close();
//     //   //win.destroy();
//     //   var windows = BrowserWindow.getAllWindows();

//     //   if (windows != null) {
//     //     for (var i = 0; i < windows.length; i++) {
//     //       windows[i].close();
//     //     }
//     //   }
//     // }
//     // dialog.showMessageBox(
//     //   {
//     //     type: "info",
//     //     title: "Update has been downloaded",
//     //     message: "Update has been down loaded, application will not quit to install",
//     //     buttons: ["Ok"]
//     //   },
//     //   buttonIndex => {
//     //     if (buttonIndex === 0) {
//     //       autoUpdater.quitAndInstall();
//     //     }
//     //   }
//     // );
//     autoUpdater.quitAndInstall();

//     // //autoUpdater.logger.debug("inside update downloaded");
//     // dialog.showMessageBox(
//     //   {
//     //     title: "Update has been downloaded!",
//     //     message: "Update has been downloaded, application will now quit to install"
//     //   },
//     //   () => {
//     //     //setImmediate(() => autoUpdater.quitAndInstall());
//     //     //autoUpdater.quitAndInstall();
//     //     // setImmediate(() => {
//     //     //   app.removeAllListeners("window-all-closed");

//     //     //   if (win) {
//     //     //     win.close();
//     //     //     //win.destroy();
//     //     //     // var windows = BrowserWindow.getAllWindows();

//     //     //     // if (windows != null) {
//     //     //     //   for (var i = 0; i < windows.length; i++) {
//     //     //     //     windows[i].close();
//     //     //     //   }
//     //     //     // }
//     //     //   }

//     //     //   //autoUpdater.quitAndInstall();
//     //     //   app.relaunch();
//     //     //   app.exit();
//     //     // });
//     //     dialog.showMessageBox({ title: "test dialog", message: "test message" });
//     //     autoUpdater.quitAndInstall();

//     //   }
//     // );
//   });

//   // autoUpdater.on("before-quit-for-update", () => {
//   //   //app.quit();
//   //   app.relaunch();
//   //   app.exit(); //If these don't work, i can try to put them in place of autoUpdater.quitAndInstall();
//   // });
// });

/**
 * Here is where the code for updating app starts
 */

let download = false;

if (!isDevelopment) {
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 120000);
}

autoUpdater.on("update-available", () => {
  let opts = {
    type: "info",
    title: "Update Found!",
    message: "An update was found, would you like to download it and restart your application?", //do an automatic count down for 5 sec unless later is pressed
    buttons: ["Yes", "Later"]
  };

  dialog.showMessageBox(opts).then(returnValue => {
    if (returnValue.response === 0) {
      download = true;
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on("update-downloaded", () => {
  if (download) {
    if (process.platform == "win32") {
      autoUpdater.quitAndInstall();
    } else {
      app.relaunch();
      app.exit();
    }
  }
});

autoUpdater.on("error", error => {
  dialog.showErrorBox("Error: ", error == null ? "unknown" : (error.stack || error).toString());
});

function dummyDRM(mode = DRM_MODE_ENCRYPT) {
  const installPath = store.getters[INSTALL_PATH];

  if (!installPath) {
    console.log("Install path not specified");

    return;
  }

  let findExt = "";
  let newExt = "";

  switch (mode) {
    case DRM_MODE_DECRYPT:
      findExt = ".drm";
      newExt = ".exe";
      break;
    case DRM_MODE_ENCRYPT:
    default:
      findExt = ".exe";
      newExt = ".drm";
  }

  const dirs = fs.readdirSync(installPath, { withFileTypes: true });

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const dirPath = path.join(installPath, dir.name);
      const dirContent = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const file of dirContent) {
        if (file.isFile()) {
          if (path.extname(file.name) === findExt) {
            const oldPath = path.parse(path.join(dirPath, file.name));
            const newName = path.parse(path.join(dirPath, file.name));
            delete newName.base;
            newName.ext = newExt;

            fs.renameSync(path.format(oldPath), path.format(newName));
          }
        }
      }
    }
  }
}

function delayedInit() {
  if (app.isQuitting) return;

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
  let isReady = false; // app ready, windows can be created
  app.ipcReady = false; // main window has finished loading and IPC is ready
  app.isQuitting = false;

  // Quit when all windows are closed.
  // app.on('window-all-closed', () => {
  //   // On macOS it is common for applications and their menu bar
  //   // to stay active until the user quits explicitly with Cmd + Q
  //   if (process.platform !== 'darwin') {
  // console.log('quitting2');//
  // app.quit();
  //   }
  // });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    } else if (isReady) {
      win.show();
    }
  });

  /**
   * If log out gives issues, put to contact API to logout from here as well if user is logged in
   */

  app.on("before-quit", e => {
    if (app.isQuitting) return;

    app.isQuitting = true;
    e.preventDefault();
    if (win) {
      console.log("Encrypting apps");
      dummyDRM(DRM_MODE_ENCRYPT);
      console.log("Apps are encrypted");

      win.send("dispatch", STATE_SAVE_IMMEDIATE); // try to save state on exit
      console.log("quitting3");
      ipcMain.once("stateSaved", () => app.quit());
      setTimeout(() => {
        console.error("Saving state took too long. Quitting.");
        console.log("quitting4");
        app.quit();
      }, 4000); // quit after 4 secs, at most
    }
  });

  // /apps and /downloads folders need to be created manually
  // if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });
  // if (!fs.existsSync(installPath)) fs.mkdirSync(installPath, { recursive: true });

  const [, appState] = await Promise.all([{ then: res => app.on("ready", () => res()) }, State.load()]);
  isReady = true;

  if (isDevelopment && !process.env.IS_TEST) {
    // FIXME: IPC is shown only in one window. In other window it remains empty
    // If require it manually then it works fine.
    // BrowserWindow.addDevToolsExtension('./node_modules/devtron');

    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }

  createWindow(appState);
  torrentWin = webtorrent.getInstance(appState);

  // To keep app startup fast, some code is delayed.
  setTimeout(() => {
    delayedInit({});
  }, 3000);

  // Report uncaught exceptions
  process.on("uncaughtException", err => {
    console.error(err);
    const error = {
      message: err.message,
      stack: err.stack
    };
    if (win) {
      win.send("dispatch", UNCAUGHT_ERROR, "main", error);
    }
  });
}

const gotInstanceLock = app.requestSingleInstanceLock();
app.on("second-instance", (e, newArgv) => {
  if (app.ipcReady) {
    console.log("Second app instance opened, but was prevented:", newArgv);
    win.show();
    win.isMinimized() && win.restore();
    win.focus();
  }
});

if (!gotInstanceLock) {
  console.log("quitting");
  app.quit();
} else {
  init();

  store.dispatch(ACTION_REFRESH);
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        console.log("quitting5");
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      console.log("quitting6");
      app.quit();
    });
  }
}

const ipc = ipcMain;
// Messages from the main process, to be sent once the WebTorrent process starts
const messageQueueMainToWebTorrent = [];

ipc.once("ipcReady", () => {
  app.ipcReady = true;
  app.emit("ipcReady");
});

ipc.once("ipcReadyWebTorrent", () => {
  app.ipcReadyWebTorrent = true;
  console.log("sending %d queued messages from the main win to the webtorrent window", messageQueueMainToWebTorrent.length);
  messageQueueMainToWebTorrent.forEach(message => {
    let ref;

    (ref = torrentWin).send.apply(ref, [message.name].concat(message.args));
    console.log("webtorrent: sent queued %s", message.name);
  });
});

/**
 * Message proxying
 */
const oldEmit = ipc.emit;
ipc.emit = function(name, e) {
  let ref;
  let ref$1;

  const args = [];
  let len = arguments.length - 2;
  while (len-- > 0) args[len] = arguments[len + 2];
  // Relay messages between the main window and the WebTorrent hidden window
  if (name.startsWith("wt-") && !app.isQuitting) {
    if (e && e.sender && e.sender.browserWindowOptions.title === "webtorrent-hidden-window") {
      // Send message to main window
      (ref = win).send.apply(ref, [name].concat(args));
      console.log("webtorrent: got %s", name);
    } else if (app.ipcReadyWebTorrent) {
      // Send message to webtorrent window
      (ref$1 = torrentWin).send.apply(ref$1, [name].concat(args));
      console.log("webtorrent: sent %s", name);
    } else {
      // Queue message for webtorrent window, it hasn't finished loading yet
      messageQueueMainToWebTorrent.push({
        name,
        args
      });
      console.log("webtorrent: queueing %s", name);
    }
    return;
  }

  // Emit all other events normally
  oldEmit.call.apply(oldEmit, [ipc, name, e].concat(args));
};

ipc.on(UNZIP_GAME, (e, msg) => {
  const { gameId, src, dst } = msg;

  fsExtra.emptyDirSync(dst);

  const unzip = require("extract-zip");

  const errors = [];

  src.forEach(file => {
    if (/\.zip$/.test(file)) {
      unzip(
        file,
        {
          dir: dst
        },
        err => {
          console.log("unzip done", file);
          if (err) {
            errors.push(err);
            console.error("Unzip error", err);
          }
        }
      );
    }
  });

  if (!errors.length) {
    store.dispatch(UNARCHIVE_OK, { payload: { gameId } });
  } else {
    store.dispatch(UNARCHIVE_FAIL, { payload: { gameId } });
  }
});

ipc.on(AUTHORIZED, token => {
  console.log("ipc: ", AUTHORIZED);
  userToken = token;
  dummyDRM(DRM_MODE_DECRYPT);
});

ipc.on(UNAUTHORIZED, () => {
  console.log("ipc: ", UNAUTHORIZED);
  dummyDRM(DRM_MODE_ENCRYPT);
});
