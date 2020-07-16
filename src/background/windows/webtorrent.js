import { app, BrowserWindow } from "electron";

let win = null;
export function getInstance({ debug } = {}) {
  if (win) {
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: "#1E1E1E",
    backgroundThrottling: false, // do not throttle animations/timers when page is background
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 150,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    title: "webtorrent-hidden-window",
    useContentSize: true,
    width: 150,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}webtorrent`);
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: "detach" });
  } else {
    // createProtocol('app');
    // Load the index.html when not in development
    win.loadURL("app://./webtorrent.html");
    if (process.env.NODE_ENV === "development" || process.env.DEBUG === "true" || process.argv.includes("--debug") || debug) {
      win.webContents.openDevTools({ mode: "detach" });
    }
  }

  // Prevent killing the WebTorrent process
  win.on("close", e => {
    if (app.isQuitting) {
      return;
    }
    e.preventDefault();
    win.hide();
  });
  return win;
}

export function show() {
  if (!win) return;
  win.show();
}

export function send(...args) {
  if (!win) return;
  win.send(...args);
}

export function toggleDevTools() {
  if (!win) return;
  if (win.webContents.isDevToolsOpened()) {
    win.webContents.closeDevTools();
    win.hide();
  } else {
    win.webContents.openDevTools({ mode: "detach" });
  }
}
