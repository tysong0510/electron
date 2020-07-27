// import devtools from '@vue/devtools'
import Vue from "vue";
import VueRouter from "vue-router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Vs from "d3-vs";
import Axios from "axios";
import VueAxios from "vue-axios";
import VueProgress from "vue-progress-path";
import VueSidebarMenu from "vue-sidebar-menu";
import electron from "electron";
import deepEqual from "deep-equal";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import Dashboard from "./plugins/dashboard";
import { baseURL } from "./apiConfig";
import {
  ADD_TORRENT,
  STOP_TORRENTS,
  TORRENT_DOWNLOADED,
  UNARCHIVE_FAIL,
  UNARCHIVE_OK,
  NEXT_TORRENT_KEY_USED,
  UPDATE_TORRENT,
  UPDATE_TORRENT_INFOHASH,
  UPDATE_TORRENT_PROGRESS
} from "./store/mutation-types";
import { USER } from "./store/modules/auth";
import "./registerServiceWorker";

import "./assets/scss/main.scss";

import { State } from "./state";
import {
  AUTHORIZED,
  STATE_SAVE,
  STATE_SAVE_IMMEDIATE,
  UNAUTHORIZED,
  UNCAUGHT_ERROR,
  UNZIP_GAME_FAIL,
  UNZIP_GAME_OK
} from "./dispatch-types";

import { START_DOWNLOAD_GAME } from "./store/actions-types";
/*
const squirrelEvents = require("../installers/windows/squirrelEvents"); //path to squirrel events
if (squirrelEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
*/

const { ipcRenderer } = electron;

const IS_DEV = process.env.NODE_ENV === "development";

Vue.use(VueProgress);

Vue.router = router;
Vue.use(VueAxios, Axios);

Vue.axios.defaults.baseURL = baseURL;

// const token = localStorage.getItem('token');
//
// if (token) {
//   Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
// }

Vue.use(VueSidebarMenu);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Dashboard);
Vue.use(VueRouter);
Vue.use(Vs);

// let store = require("electron").remote.getGlobal("vuexStore");

const app = new Vue({
  router,
  store,
  i18n,
  mounted() {
    // Prevent blank screen in Electron builds
    // this.$router.push({ name: 'home' });

    const that = this;

    ipcRenderer.on(UNAUTHORIZED, message => {
      console.log(UNAUTHORIZED, message);

      if (message && message.reason) {
        that.$bvModal.msgBoxOk(message.reason, {
          title: "Authorization failed",
          size: "sm",
          okVariant: "outline-secondary",
          id: "auth-error",
          headerClass: "p-2 border-bottom-0 m-auto",
          bodyClass: "text-center",
          footerClass: "m-auto border-0",
          centered: true
        });
      }
    });
  },
  render: h => h(App)
}).$mount("#app");

window.app = app;

if (IS_DEV) {
  try {
    window.require("devtron").install();
  } catch (e) {
    console.log(e);
  }
}

// Save is restored on app load and saved before quitting
let state;

function getSavedGlobalState() {
  return {};
}

function getSavedUserState() {
  // Hack to avoid reactivity. Otherwise undefined is saved
  const vueTorrents = JSON.parse(JSON.stringify(app.$store.state.torrents));
  const result = {
    ...state,
    vue: {
      route: {
        name: app.$route.name,
        params: app.$route.params
      }
    },
    torrents: vueTorrents.map(t => ({
      gameId: t.gameId,
      downloaded: t.downloaded,
      infoHash: t.infoHash,
      path: t.path,
      state: t.state,
      torrentFileName: t.torrentFileName,
      torrentURL: t.torrentURL
    }))
  };
  console.log("saved state=", result);
  console.log("vue state", app.$store.state);
  return result;
}

// function getGlobalSavedState() {
//   return {
//     ...state,
//     vue: {
//       route: {
//         name: app.$route.name,
//         params: app.$route.params,
//       },
//     },
//     auth: {
//       token: app.$store.state.auth.token
//     }
//   };
// }
//
// function getUserSavedState() {
//   const vueTorrents = JSON.parse(JSON.stringify(app.$store.state.torrents));
//
//   const result = {
//     ...state,
//     torrents: vueTorrents.map(t => ({
//       gameId: t.gameId,
//       downloaded: t.downloaded,
//       infoHash: t.infoHash,
//       path: t.path,
//       state: t.state,
//       torrentFileName: t.torrentFileName,
//       torrentURL: t.torrentURL,
//     })),
//   };
//
//   console.log('saved state=', result);
//   console.log('vue state', app.$store.state);
//
//   return result;
// }

const dispatchHandlers = {
  [STATE_SAVE]: () => {
    State.save(getSavedGlobalState());
    const { username } = app.$store.state.auth.user;
    if (username !== void 0) {
      State.saveUser(username, getSavedUserState());
    }
  },
  [STATE_SAVE_IMMEDIATE]: () => {
    State.saveImmediate(getSavedGlobalState());
    const { username } = app.$store.state.auth.user;
    if (username !== void 0) {
      State.saveUserImmediate(username, getSavedUserState());
    }
  },
  error: err => {
    console.error(err.stack || err);
  },
  [UNCAUGHT_ERROR]: err => {
    console.error("Uncaught error", err.stack || err);
    console.log("Uncaught error message", err.message || "");
  }
};

function dispatch(action, ...args) {
  const handler = dispatchHandlers[action];
  if (handler) handler(...args);
  else console.error(`Missing dispatch handler: ${action}`);
}

function setupIpc() {
  ipcRenderer.on("wt-infohash", (e, torrentKey, infoHash) => {
    console.log("wt-metadata", torrentKey, infoHash);
    const { getters, dispatch } = app.$store;
    const { findTorrentByInfoHash } = getters;
    const existingTorrent = findTorrentByInfoHash(infoHash);
    if (existingTorrent && existingTorrent.torrentKey !== torrentKey) {
      ipcRenderer.send("wt-stop-torrenting", infoHash);
      return dispatch("error", "Cannot add duplicate torrent");
    }
    dispatch({
      type: UPDATE_TORRENT_INFOHASH,
      payload: {
        torrentKey,
        infoHash
      }
    });
  });

  ipcRenderer.on("wt-metadata", (e, torrentKey, torrentInfo) => {
    console.log("wt-metadata", torrentKey, torrentInfo);
    const { getters, dispatch } = app.$store;
    const { findTorrentByKey } = getters;
    const torrent = findTorrentByKey(torrentKey);
    if (torrent) {
      dispatch({
        type: UPDATE_TORRENT,
        //type:STOP_TORRENTS,
        payload: {
          torrentKey,
          state: "downloading",
          path: torrentInfo.path
        }
      });

      // Save the .torrent file, if it hasn't been saved already
      if (!torrent.torrentFileName) {
        ipcRenderer.send("wt-save-torrent-file", torrentKey);
      }
    }
  });

  ipcRenderer.on("wt-file-saved", (e, torrentKey, torrentFileName) => {
    console.log("torrent file saved %s: %s", torrentKey, torrentFileName);

    const { getters } = app.$store;
    const { findTorrentByKey } = getters;
    const torrent = findTorrentByKey(torrentKey);
    if (torrent) {
      app.$store.dispatch({
        type: UPDATE_TORRENT,
        payload: {
          torrentKey,
          torrentFileName
        }
      });
      dispatch(STATE_SAVE);
    }
  });

  ipcRenderer.on("wt-progress", (e, progressInfo) => {
    progressInfo.torrents.forEach(p => {
      const { torrentKey } = p;
      const { getters, dispatch } = app.$store;
      const { findTorrentByKey } = getters;
      const torrent = findTorrentByKey(torrentKey);
      // Skip progress update if torrent is not ready
      if (torrent && !deepEqual(torrent.progress, p) && p.ready) {
        if (torrent.downloaded && p.progress !== 1) {
          // Reset done
          dispatch({
            type: UPDATE_TORRENT,
            payload: {
              torrentKey,
              downloaded: false
            }
          });
        }
        const patch = {
          torrentKey,
          progress: p
        };
        dispatch({
          type: UPDATE_TORRENT_PROGRESS,
          payload: patch
        });
      }
    });
  });

  ipcRenderer.on("wt-done", (e, torrentKey, torrentInfo) => {
    console.log("wt-done", torrentKey, torrentInfo);
    const { getters, dispatch } = app.$store;
    const { findTorrentByKey } = getters;
    const { files } = torrentInfo;
    const torrent = findTorrentByKey(torrentKey);
    // console.log('wt-done', torrentKey, torrent);
    if (torrent) {
      console.log("wt-done START SEEDING");
      dispatch({
        type: UPDATE_TORRENT,
        payload: {
          torrentKey,
          downloaded: true,
          state: "seeding",
          files
        }
      });
    }

    // if (torrentInfo.bytesReceived > 0) {
    console.log("wt-done TORRENT_DOWNLOADED");
    dispatch({
      type: TORRENT_DOWNLOADED,
      payload: {
        torrentKey
      }
    });
    // ipcRenderer.send('downloadFinished', getTorrentPath(torrentSummary))
    // }

    // if (torrent && !torrent.unarchived) {
    //   // Autorun unzip
    //   dispatch(UNARCHIVE_GAME, {
    //     gameId: torrent.gameId
    //   });
    // }
  });

  ipcRenderer.on(UNZIP_GAME_OK, (e, gameId) => {
    console.log("UNARCHIVE_OK", gameId);
    const { dispatch } = app.$store;
    dispatch({
      type: UNARCHIVE_OK,
      payload: { gameId }
    });
  });
  ipcRenderer.on(UNZIP_GAME_FAIL, (e, gameId) => {
    console.log("UNARCHIVE_FAIL", gameId);
    const { dispatch } = app.$store;
    dispatch({
      type: UNARCHIVE_FAIL,
      payload: { gameId }
    });
  });

  ipcRenderer.on("wt-warning", (e, torrentKey, message) => {
    console.warn(`torrentKey=${torrentKey}, msg: ${message}`);
  });

  ipcRenderer.on("wt-error", (e, torrentKey, message) => {
    console.log("inside wt-error in main.js");
    console.error("wt-error", torrentKey, message);
    // const torrent = store.getters.findTorrentByKey(torrentKey);
    // const { state } = torrent;
    const { dispatch } = app.$store;
    dispatch({
      type: UPDATE_TORRENT,
      //type:STOP_TORRENTS,
      payload: {
        torrentKey,
        state: "error",
        errorMessage: message
      }
    });
  });

  ipcRenderer.on("dispatch", (e, ...args) => dispatch(...args));
  State.on("stateSaved", () => ipcRenderer.send("stateSaved"));
}

setupIpc();

// Remove all torrents to reset webtorrent state (fixes hot-reload issues because of desynchronization)
// FIXME: sometimes it finishes after load state
ipcRenderer.send("wt-reset");

// ipcRenderer.once(AUTHORIZED, () => {
//   ipcRenderer.send('wt-reset');
// });

function startSeeding() {
  ipcRenderer.once(UNAUTHORIZED, () => {
    console.log(UNAUTHORIZED, store);
    if (router.currentRoute.meta.auth) {
      router.push({ name: "home" });
    }

    store.dispatch(STOP_TORRENTS);

    ipcRenderer.once(AUTHORIZED, startSeeding);
  });
}

ipcRenderer.once(AUTHORIZED, startSeeding);

ipcRenderer.once("wt-reset-ok", () => {
  State.load().then(s => {
    state = s;
    // Improve Dev Exp: Restore last page you worked in
    // if (IS_DEV && state.vue && state.vue.route) {
    //   app.$router.push(state.vue.route);
    // }
    const { torrents = [] } = state;
    const { state: storeState, dispatch, getters } = app.$store;
    if (getters["IS_LOGGED_IN"]) {
      const user = getters[USER];
      console.log(`user ${user}`);
      torrents.forEach(t => {
        if (!t || !t.infoHash) {
          return;
        }
        const torrentKey = storeState.nextTorrentKey;
        dispatch(NEXT_TORRENT_KEY_USED);
        const originalState = t.state;
        const torrent = {
          ...t,
          torrentKey,
          // Force pause
          state: "paused"
        };
        console.log("restoring torrent state", torrent, {
          dwnld: t.downloaded,
          notpaused: originalState !== "paused",
          start: t.downloaded || originalState !== "paused"
        });
        dispatch({
          type: ADD_TORRENT,
          payload: torrent
        });
        if (t.downloaded || originalState !== "paused") {
          console.log("dispatching start download", torrent.gameId);
          // seed downloaded or download not paused
          dispatch(START_DOWNLOAD_GAME, { gameId: torrent.gameId });
        }
      });
    }
    // setInterval(() => { State.saveImmediate(getSavedState()) }, 5000);
  });
});
