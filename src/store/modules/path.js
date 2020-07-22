import Vue from "vue";
import Vuex from "vuex";
import { app, remote } from "electron";
import path from "path";
import fs from "fs";
import { USER } from "./auth";

Vue.use(Vuex);

export const DOWNLOAD_PATH = "DOWNLOAD_PATH";
export const TORRENTS_PATH = "TORRENTS_PATH";
export const GAME_DOWNLOAD_PATH = "GAME_DOWNLOAD_PATH";
export const INSTALL_PATH = "INSTALL_PATH";
export const GAME_INSTALL_PATH = "GAME_INSTALL_PATH";
export const IS_GAME_INSTALLED = "IS_GAME_INSTALLED";
export const CAN_GAME_INSTALL = "CAN_GAME_INSTALL";
export const USER_CONFIG_PATH = "USER_CONFIG_PATH";
export const TEMP_INSTALL_PATH = "TEMP_INSTALL_PATH";

const USER_DATA_PATH = (app || remote.app).getPath("userData");
const VOXPOP = "voxpop";
const DOWNLOADS = "downloads";
const APPS = "apps";
const TORRENTS = "torrents";
const TEMP = "TEMP";

console.log("=================== USER_DATA_PATH =====================", USER_DATA_PATH);

/**
 * The function recursively creates directories in the specified path if they do not exist
 *
 * @param {string} dirPath - Path to directory
 * @param {object | number} options - The same as [here](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)
 */
function mkdirDeep(dirPath, options = undefined) {
  if (!fs.existsSync(dirPath)) {
    mkdirDeep(path.join(dirPath, ".."), options);
    fs.mkdirSync(dirPath, options);
  }
}

export default {
  state: {
    lastInstallPath: ""
  },
  mutations: {},
  getters: {
    [TORRENTS_PATH](state, getters) {
      const user = getters[USER];

      if (!user) {
        return null;
      }

      const { username } = user;

      if (!username) {
        return null;
      }

      const userTorrentsPath = path.join(USER_DATA_PATH, VOXPOP, String(username), TORRENTS);

      if (!fs.existsSync(userTorrentsPath)) {
        mkdirDeep(userTorrentsPath);

        console.log(`Directory '${userTorrentsPath}' created`);
      }

      return userTorrentsPath;
    },
    [GAME_DOWNLOAD_PATH](state, getters) {
      /**
       * Returned string path where user and gameId is defined else return null
       *
       * @param {number} gameId
       * @return {string | null}
       */
      return (gameId, createDir = true) => {
        const user = getters[USER];

        if (!user || !gameId) {
          return null;
        }

        const { username } = user;

        if (!username) {
          return null;
        }

        const gameDownloadPath = path.join(USER_DATA_PATH, VOXPOP, String(username), DOWNLOADS, String(gameId));

        if (createDir && !fs.existsSync(gameDownloadPath)) {
          mkdirDeep(gameDownloadPath);

          console.log(`Directory '${gameDownloadPath}' created`);
        }

        return gameDownloadPath;
      };
    },
    [INSTALL_PATH](state, getters) {
      const user = getters[USER];
      const { username } = user;

      if (!username) {
        if (state.lastInstallPath) {
          return state.lastInstallPath;
        }

        return null;
      }

      const installPath = path.join(USER_DATA_PATH, VOXPOP, String(username), APPS);

      if (!fs.existsSync(installPath)) {
        mkdirDeep(installPath);

        console.log(`Directory '${installPath}' created`);
      }

      state.lastInstallPath = installPath;

      return installPath;
    },
    [USER_CONFIG_PATH](state, getters) {
      const user = getters[USER];

      if (!user) {
        return null;
      }

      const { username } = user;

      if (!username) {
        return null;
      }

      const userConfigPath = path.join(USER_DATA_PATH, VOXPOP, String(username));

      if (!fs.existsSync(userConfigPath)) {
        mkdirDeep(userConfigPath);

        console.log(`Directory '${userConfigPath}' created`);
      }

      return userConfigPath;
    },
    [TEMP_INSTALL_PATH](state, getters) {
      /**
       * Returned string path where user and gameId is defined else return null
       *
       * @param {number} gameId
       * @return {string | null}
       */
      return (gameId, createDir = true) => {
        const user = getters[USER];

        if (!user || !gameId) {
          return null;
        }

        const { username } = user;

        if (!username) {
          return null;
        }

        const gameInstallPath = path.join(USER_DATA_PATH, VOXPOP, String(username), APPS, TEMP, String(gameId));

        if (createDir && !fs.existsSync(gameInstallPath)) {
          mkdirDeep(gameInstallPath);

          console.log(`Directory '${gameInstallPath}' created`);
        }

        return gameInstallPath;
      };
    },
    [GAME_INSTALL_PATH](state, getters) {
      /**
       * Returned string path where user and gameId is defined else return null
       *
       * @param {number} gameId
       * @return {string | null}
       */
      return (gameId, createDir = true) => {
        const user = getters[USER];

        if (!user || !gameId) {
          return null;
        }

        const { username } = user;

        if (!username) {
          return null;
        }

        const gameInstallPath = path.join(USER_DATA_PATH, VOXPOP, String(username), APPS, String(gameId));

        if (createDir && !fs.existsSync(gameInstallPath)) {
          mkdirDeep(gameInstallPath);

          console.log(`Directory '${gameInstallPath}' created`);
        }

        return gameInstallPath;
      };
    },
    [IS_GAME_INSTALLED](state, getters) {
      return gameId => {
        const installPath = getters[GAME_INSTALL_PATH](gameId);

        if (!installPath) {
          return false;
        }

        const execFiles = fs.readdirSync(installPath).filter(absPath => path.extname(absPath).toLowerCase() === ".exe");

        return gameId && getters[GAME_INSTALL_PATH](gameId) && execFiles.length;
      };
    },
    [CAN_GAME_INSTALL](state, getters) {
      return gameId => {
        const downloadPath = getters[GAME_DOWNLOAD_PATH](gameId);

        if (!downloadPath) {
          return false;
        }

        const torrent = getters.findTorrentByGameId(gameId);

        if (torrent) {
          return torrent.downloaded;
        } else {
          return !!fs.readdirSync(downloadPath).filter(absPath => path.extname(absPath).toLowerCase() === ".zip").length;
        }
      };
    }
  }
};
