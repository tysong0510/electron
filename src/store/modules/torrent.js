import Vue from "vue";
import Vuex from "vuex";
import path from "path";
import fs from "fs";
import { PAUSE_DOWNLOAD_GAME, START_DOWNLOAD_GAME, START_GAME, UNARCHIVE_GAME } from "../actions-types";
import {
  ADD_TORRENT,
  NEXT_TORRENT_KEY_USED,
  TORRENT_DOWNLOADED,
  TORRENT_DOWNLOADING,
  UNARCHIVE_FAIL,
  UNARCHIVE_OK,
  UNARCHIVE_START,
  UPDATE_TORRENT,
  UPDATE_TORRENT_INFOHASH,
  UPDATE_TORRENT_PROGRESS
} from "../mutation-types";
import { UNZIP_GAME } from "../../dispatch-types";
import { GAME_DOWNLOAD_PATH, GAME_INSTALL_PATH } from "./path";

const electron = require("electron");

const { ipcMain, ipcRenderer, shell } = electron;

Vue.use(Vuex);

function patchCollectionItemByKey(items, itemPatch, keyName) {
  const needleKey = itemPatch[keyName];
  return items.map(item => {
    if (item[keyName] !== needleKey) {
      return item;
    }
    return { ...item, ...itemPatch };
  });
}

export default {
  state: {
    nextTorrentKey: 1,
    torrents: []
  },
  mutations: {
    [ADD_TORRENT](state, { payload }) {
      const defaults = {
        state: "pending",
        downloaded: false
      };
      const data = {
        ...defaults,
        ...payload
      };

      state.torrents = [...state.torrents, data];
    },
    [UPDATE_TORRENT](state, { payload }) {
      const keys = ["torrentKey", "infoHash"];
      if (
        !keys.some(keyName => {
          const keyValue = payload[keyName];
          if (keyValue !== void 0) {
            state.torrents = patchCollectionItemByKey(state.torrents, payload, keyName);
            return true;
          }
        })
      ) {
        throw new Error("keys not found in UPDATE_TORRENT payload");
      }
    },
    [UPDATE_TORRENT_INFOHASH](state, { payload }) {
      state.torrents = patchCollectionItemByKey(
        state.torrents,
        { infoHash: payload.infoHash, torrentKey: payload.torrentKey },
        "torrentKey"
      );
    },
    [TORRENT_DOWNLOADING](state, { payload }) {
      state.torrents = patchCollectionItemByKey(state.torrents, { state: "downloading", torrentKey: payload.torrentKey }, "torrentKey");
    },
    [UPDATE_TORRENT_PROGRESS](state, { payload }) {
      state.torrents = patchCollectionItemByKey(
        state.torrents,
        { progress: payload.progress, torrentKey: payload.torrentKey },
        "torrentKey"
      );
    },
    [TORRENT_DOWNLOADED](state, { payload }) {
      state.torrents = patchCollectionItemByKey(state.torrents, { downloaded: true, torrentKey: payload.torrentKey }, "torrentKey");
    },
    [NEXT_TORRENT_KEY_USED](state) {
      state.nextTorrentKey++;
    },
    [UNARCHIVE_START](state, { payload }) {
      const { gameId } = payload;
      state.torrents = patchCollectionItemByKey(state.torrents, { unarchiving: true, unarchiveError: false, gameId }, "gameId");
    },
    [UNARCHIVE_OK](state, { payload }) {
      const { gameId } = payload;
      state.torrents = patchCollectionItemByKey(state.torrents, { unarchiving: false, unarchived: true, gameId }, "gameId");
    },
    [UNARCHIVE_FAIL](state, { payload }) {
      const { gameId } = payload;
      state.torrents = patchCollectionItemByKey(
        state.torrents,
        {
          unarchiving: false,
          unarchived: false,
          unarchiveError: true,
          gameId
        },
        "gameId"
      );
    }
  },
  actions: {
    async [START_GAME]({ state, getters }, { gameId }) {
      // TODO once file is downloaded to `gameDownloadPath` it needs to be processed with game install script;
      //  the game will be installed to `gameInstalationPath`
      const { game } = state;
      if (!game) {
        return;
      }
      const gamePath = path.join(getters[GAME_INSTALL_PATH](gameId), "Beglitched.exe");
      if (!fs.existsSync(gamePath)) alert("Game is not installed");
      shell.openItem(gamePath);
    },

    [ADD_TORRENT]({ commit }, data) {
      commit(ADD_TORRENT, data);
    },

    [TORRENT_DOWNLOADED]({ commit }, data) {
      commit(TORRENT_DOWNLOADED, data);
    },

    [UPDATE_TORRENT]({ commit }, data) {
      commit(UPDATE_TORRENT, data);
    },

    [UPDATE_TORRENT_PROGRESS]({ commit }, data) {
      commit(UPDATE_TORRENT_PROGRESS, data);
    },

    [NEXT_TORRENT_KEY_USED]({ commit }) {
      commit(NEXT_TORRENT_KEY_USED);
    },

    [UPDATE_TORRENT_INFOHASH]({ commit }, data) {
      commit(UPDATE_TORRENT_INFOHASH, data);
    },

    async [START_DOWNLOAD_GAME]({ state, commit, getters }, { gameId }) {
      const { findTorrentByGameId } = getters;
      let torrent = findTorrentByGameId(gameId);
      let magnetURI;
      if (!torrent) {
        const { game } = state;
        if (!game) {
          console.error(`START_DOWNLOAD_GAME: game id=${gameId} not found`);
          return;
        }
        ({ magnetURI } = game);
      } else {
        ({ torrentURL: magnetURI } = torrent);
      }
      if (!magnetURI) {
        console.error(`START_DOWNLOAD_GAME: no magnetURI for game id=${gameId}`);
        return;
      }
      let torrentKey;

      const gameInstallPath = getters[GAME_INSTALL_PATH](gameId);
      const gameDownloadPath = getters[GAME_DOWNLOAD_PATH](gameId);

      if (!fs.existsSync(gameDownloadPath)) fs.mkdirSync(gameDownloadPath, { recursive: true });
      if (!fs.existsSync(gameInstallPath)) fs.mkdirSync(gameInstallPath, { recursive: true });

      if (torrent) {
        ({ torrentKey } = torrent);
        if (torrent.state === "downloading") {
          console.log("inside torrent state downloading");
          // nothing to do
          return;
        }
        commit({
          type: TORRENT_DOWNLOADING,
          payload: {
            torrentKey
          }
        });
      } else {
        torrentKey = state.nextTorrentKey;
        commit(NEXT_TORRENT_KEY_USED);
        const addTorrentMsg = {
          type: ADD_TORRENT,
          payload: {
            gameId,
            state: "loading-metadata",
            torrentURL: magnetURI,
            torrentKey
          }
        };
        commit(addTorrentMsg);
        torrent = findTorrentByGameId(gameId);
      }

      const { torrentFile, torrentURL } = torrent;
      const torrentId = torrentFile || torrentURL;

      if (!ipcRenderer) {
        console.log("ipdRenderer emit in torrent js");
        ipcMain.emit(
          "wt-start-torrenting",
          null,
          torrentKey, // key
          torrentId,
          gameDownloadPath,
          null
        );
        return;
      }

      console.log("right above ipcRendere.send in torrent.js inside start download game action");
      ipcRenderer.send(
        "wt-start-torrenting",
        torrentKey, // key
        torrentId,
        gameDownloadPath,
        null
        // select all torrent files by default
      );
    },

    async [PAUSE_DOWNLOAD_GAME]({ commit, getters }, { gameId }) {
      const { findTorrentByGameId } = getters;
      const torrent = findTorrentByGameId(gameId);
      if (!torrent) {
        return;
      }
      const { infoHash, torrentKey } = torrent;
      commit({
        type: UPDATE_TORRENT,
        payload: {
          state: "paused",
          infoHash,
          torrentKey
        }
      });
      if (infoHash) {
        if (!ipcRenderer) {
          ipcMain.emit("wt-stop-torrenting", null, infoHash);
          return;
        }
        ipcRenderer.send("wt-stop-torrenting", infoHash);
      } else {
        // metadata hasn't been parsed yet. when metadata will be received torrent will be paused
      }
    },

    async [UNARCHIVE_GAME]({ commit, getters }, { gameId }) {
      const { findTorrentByGameId, getGameInstallPath } = getters;
      const torrent = findTorrentByGameId(gameId);
      if (!torrent) {
        return;
      }
      commit({
        type: UNARCHIVE_START,
        payload: { gameId }
      });

      const src = torrent.files
        .map(torrentFile => path.join(torrent.path, torrentFile.path))
        .filter(absPath => path.extname(absPath).toLowerCase() === ".zip");

      if (!ipcRenderer) {
        ipcMain.emit(UNZIP_GAME, null, {
          gameId, // s
          src,
          dst: getGameInstallPath(gameId)
        });
        return;
      }

      ipcRenderer.send(UNZIP_GAME, {
        gameId, // s
        src,
        dst: getGameInstallPath(gameId)
      });
    }
  }
};
