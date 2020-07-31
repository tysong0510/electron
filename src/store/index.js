import Vue from "vue";
import Vuex from "vuex";
import path from "path";
import fs from "fs";
//import Axios from 'axios';
import { createSharedMutations } from "vuex-electron";
import {
  INSTALL_GAME,
  PAUSE_DOWNLOAD_GAME,
  START_DOWNLOAD_GAME,
  START_GAME,
  START_SEEDING,
  UNARCHIVE_GAME,
  UNINSTALL_GAME
  //ADD_TO_CART
} from "./actions-types";
import {
  ADD_TORRENT,
  ADD_TORRENT_SEED,
  CLEAR_TORRENTS,
  NEXT_TORRENT_KEY_USED,
  STOP_TORRENTS,
  TORRENT_DOWNLOADED,
  TORRENT_DOWNLOADING,
  UNARCHIVE_FAIL,
  UNARCHIVE_OK,
  UNARCHIVE_START,
  UPDATE_GAME,
  UPDATE_TORRENT,
  UPDATE_TORRENT_INFOHASH,
  UPDATE_TORRENT_PROGRESS
} from "./mutation-types";

import news from "./news";
import games from "./games";
import users from "./users";
import { UNZIP_GAME } from "../dispatch-types";
import createPromiseAction from "../plugins/promiseAction";
import auth, { USER } from "./modules/auth";
import Axios from "axios";
import child_process from "child_process";
// import torrent from './modules/torrent';
import storePathModule, { GAME_DOWNLOAD_PATH, GAME_INSTALL_PATH } from "./modules/path";
import fsExtra from "fs-extra";
// import sharedMutation from '../plugins/shared-mutations';

const electron = require("electron");

const { ipcMain, ipcRenderer /*, app, remote, shell */ } = electron;

Vue.use(Vuex);
// const userDataPath = (app || remote.app).getPath('userData');
// const downloadPath = path.join(userDataPath, 'downloads');

/**
 * Library for deep merging objects
 * @see https://github.com/TehShrike/deepmerge
 */
const deepMerge = require("deepmerge");

const storage = require("electron-json-storage");

/*let savedCart;
storage.get("cart", function(err, data) {
  if (err) {
    console.log("error with retrieving cart: ", err);
  } else {
    console.log("data gotten from cart: ", data);
    savedCart = data;
  }
});*/

const demoData = {
  state: {
    demoData: {
      games: [],
      rating: {
        "store-top": {
          day: [
            {
              id: "1",
              value: Math.random() * 10
            },
            {
              id: "2",
              value: Math.random() * 10
            },
            {
              id: "3",
              value: Math.random() * 10
            },
            {
              id: "4",
              value: Math.random() * 10
            },
            {
              id: "5",
              value: Math.random() * 10
            },
            {
              id: "6",
              value: Math.random() * 10
            },
            {
              id: "7",
              value: Math.random() * 10
            },
            {
              id: "8",
              value: Math.random() * 10
            },
            {
              id: "9",
              value: Math.random() * 10
            },
            {
              id: "10",
              value: Math.random() * 10
            },
            {
              id: "11",
              value: Math.random() * 10
            },
            {
              id: "12",
              value: Math.random() * 10
            }
          ],
          week: [
            {
              id: "1",
              value: Math.random() * 10
            },
            {
              id: "2",
              value: Math.random() * 10
            },
            {
              id: "3",
              value: Math.random() * 10
            },
            {
              id: "4",
              value: Math.random() * 10
            },
            {
              id: "5",
              value: Math.random() * 10
            },
            {
              id: "6",
              value: Math.random() * 10
            },
            {
              id: "7",
              value: Math.random() * 10
            },
            {
              id: "8",
              value: Math.random() * 10
            },
            {
              id: "9",
              value: Math.random() * 10
            },
            {
              id: "10",
              value: Math.random() * 10
            },
            {
              id: "11",
              value: Math.random() * 10
            },
            {
              id: "12",
              value: Math.random() * 10
            }
          ],
          month: [
            {
              id: "1",
              value: Math.random() * 10
            },
            {
              id: "2",
              value: Math.random() * 10
            },
            {
              id: "3",
              value: Math.random() * 10
            },
            {
              id: "4",
              value: Math.random() * 10
            },
            {
              id: "5",
              value: Math.random() * 10
            },
            {
              id: "6",
              value: Math.random() * 10
            },
            {
              id: "7",
              value: Math.random() * 10
            },
            {
              id: "8",
              value: Math.random() * 10
            },
            {
              id: "9",
              value: Math.random() * 10
            },
            {
              id: "10",
              value: Math.random() * 10
            },
            {
              id: "11",
              value: Math.random() * 10
            },
            {
              id: "12",
              value: Math.random() * 10
            }
          ],
          year: [
            {
              id: "1",
              value: Math.random() * 10
            },
            {
              id: "2",
              value: Math.random() * 10
            },
            {
              id: "3",
              value: Math.random() * 10
            },
            {
              id: "4",
              value: Math.random() * 10
            },
            {
              id: "5",
              value: Math.random() * 10
            },
            {
              id: "6",
              value: Math.random() * 10
            },
            {
              id: "7",
              value: Math.random() * 10
            },
            {
              id: "8",
              value: Math.random() * 10
            },
            {
              id: "9",
              value: Math.random() * 10
            },
            {
              id: "10",
              value: Math.random() * 10
            },
            {
              id: "11",
              value: Math.random() * 10
            },
            {
              id: "12",
              value: Math.random() * 10
            }
          ],
          all: [
            {
              id: "1",
              value: Math.random() * 10
            },
            {
              id: "2",
              value: Math.random() * 10
            },
            {
              id: "3",
              value: Math.random() * 10
            },
            {
              id: "4",
              value: Math.random() * 10
            },
            {
              id: "5",
              value: Math.random() * 10
            },
            {
              id: "6",
              value: Math.random() * 10
            },
            {
              id: "7",
              value: Math.random() * 10
            },
            {
              id: "8",
              value: Math.random() * 10
            },
            {
              id: "9",
              value: Math.random() * 10
            },
            {
              id: "10",
              value: Math.random() * 10
            },
            {
              id: "11",
              value: Math.random() * 10
            },
            {
              id: "12",
              value: Math.random() * 10
            }
          ]
        },
        "store-featured": {
          day: [
            {
              id: "2"
            },
            {
              id: "4"
            }
          ],
          week: [
            {
              id: "2"
            },
            {
              id: "4"
            },
            {
              id: "1"
            },
            {
              id: "3"
            }
          ],
          month: [
            {
              id: "2"
            },
            {
              id: "4"
            },
            {
              id: "1"
            },
            {
              id: "3"
            },
            {
              id: "5"
            }
          ],
          year: [
            {
              id: "2"
            },
            {
              id: "4"
            },
            {
              id: "1"
            },
            {
              id: "3"
            },
            {
              id: "5"
            },
            {
              id: "6"
            },
            {
              id: "7"
            }
          ],
          all: [
            {
              id: "2"
            },
            {
              id: "4"
            },
            {
              id: "1"
            },
            {
              id: "3"
            },
            {
              id: "5"
            },
            {
              id: "6"
            },
            {
              id: "7"
            },
            {
              id: "8"
            },
            {
              id: "9"
            }
          ]
        },
        "store-all": "*",
        "my-top-games": [
          {
            id: "1",
            value: 1
          },
          {
            id: "2",
            value: 2
          },
          {
            id: "3",
            value: 3
          },
          {
            id: "4",
            value: "4"
          },
          {
            id: "5",
            value: 5
          }
        ],
        "my-files": "*",
        "my-recommendation": "recommendation",
        "user-recommendation": "*",
        "recently-played": "*"
      },
      stores: [
        {
          name: "store-top",
          title: "Top",
          sort: true,
          order: "DESC"
        },
        {
          name: "store-featured",
          title: "Featured"
        },
        {
          name: "store-all",
          title: "All Games"
        },
        {
          name: "my-top-games",
          title: "Your top games",
          sort: true,
          order: "ASC"
        },
        {
          name: "my-files",
          title: "Your files",
          sort: true,
          byField: "id"
        },
        {
          name: "my-recommendation",
          title: "Your recommendation",
          sort: false
        },
        {
          name: "user-recommendation",
          title: "User Recommendation",
          sort: false
        },
        {
          name: "recently-played",
          title: "Recently played",
          sort: false
        }
      ],
      filters: {
        "store-top": {
          default: "day",
          options: [
            {
              value: null,
              text: "-- Please select period --",
              disabled: true
            },
            {
              value: "day",
              text: "Day"
            },
            {
              value: "week",
              text: "Week"
            },
            {
              value: "month",
              text: "Month"
            },
            {
              value: "year",
              text: "Year"
            },
            {
              value: "all",
              text: "All Time"
            }
          ]
        },
        "store-featured": {
          default: "day",
          options: [
            {
              value: null,
              text: "-- Please select period --",
              disabled: true
            },
            {
              value: "day",
              text: "Day"
            },
            {
              value: "week",
              text: "Week"
            },
            {
              value: "month",
              text: "Month"
            },
            {
              value: "year",
              text: "Year"
            },
            {
              value: "all",
              text: "All Time"
            }
          ]
        }
      }
    },
    nextTorrentKey: 1, // identify torrents for IPC between the main and webtorrent windows
    torrents: [],
    cart: [], //savedData ? savedCart : [], //if there are any items saved in savedCart variable set cart equal to them, else new array
    tempInstallPath: null,
    tempDownloadedGames: [],
    recommendedGames: [],
    recoUserAndGame: [],
    recommendedUserIdIndex: [],
    votedGames: [],
    absolutePath: null
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
    [ADD_TORRENT_SEED](state, { payload }) {
      const defaults = {
        state: "seeding",
        downloaded: true
      };
      const data = {
        ...defaults,
        ...payload
      };

      state.torrents = [...state.torrents, data];
    },
    [CLEAR_TORRENTS](state) {
      state.torrents = [];
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
    },

    addToCart(state, data) {
      state.cart.push(data);
      state.cartLength++;
      console.log("length of shopping cart: " + state.cart.length);
      this.dispatch("saveCart");
    },

    removeFromCart(state, index) {
      // this.dispatch("removeUserRecommendedIdIndex", index);
      // state.cart.splice(index, 1);
      // this.dispatch("saveCart");

      state.cart.splice(index, 1);
    },
    clearCart(state) {
      state.cart.splice(0, state.cart.length);
      this.dispatch("saveCart");
    },
    saveCart(state) {
      console.log("inside save cart");
      //localStorage.setItem("cart", state.cart);
      storage.set("cart", state.cart, function(err) {
        if (err) {
          console.log("Error with saving data: ", err);
        }
      });
    },
    savePath(state, path) {
      state.tempInstallPath = path;
      storage.set("path", state.tempInstallPath, function(err) {
        if (err) {
          console.log("error saving path: ", err);
        }
      });
    },
    retrievePath(state) {
      //console.log("user path: ", storage.get("path"));
      //return storage.get("path");
      storage.get("path", function(err, data) {
        if (err) {
          console.log("error retrieving path: ", err);
        } else {
          console.log("user path from index.js: ", data);
          state.tempInstallPath = data;
          return data;
        }
      });
    },
    removePath() {
      storage.remove("path", function(err) {
        if (err) {
          console.log("error removing path: ", err);
        }
      });
    },
    addDownloadedGame(state, savedContent) {
      console.log("game to be added to downloaded array: ", savedContent.game, "path: ", savedContent.path, " in mutation");
      state.tempDownloadedGames[savedContent.game.id] = savedContent.path;
      //state.tempDownloadedGames.push(savedContent.path);
      console.log("tempDownloadedGames array: ", state.tempDownloadedGames);
      storage.set("downloadedGame", state.tempDownloadedGames, function(err) {
        console.log("there was an error saving downloadedGames: ", err);
      });
    },
    retrieveDownloadedGame(state) {
      storage.get("downloadedGame", function(err, data) {
        if (err) {
          console.log("there was an error retrieving game: ", err);
        } else {
          state.tempDownloadedGames = data;
        }
      });
    },
    removeDownloadedGames() {
      storage.remove("downloadedGame", function(err) {
        if (err) {
          console.log("there was an error removing downloadedGames: ", err);
        }
      });
    },
    tempDownloadPath(state, path) {
      console.log("path from mutation: ", path);
      state.absolutePath = path;
    },
    addToRecommendedGames(state, recoParams) {
      state.recommendedGames.push(recoParams.game);

      // storage.set(recoParams.username, state.recommendedGames, function(err) {
      //   if (err) {
      //     console.log("There was an error saving recommended games: ", err);
      //   }
      // });

      return new Promise((resolve, reject) => {
        storage.set(recoParams.username, state.recommendedGames, function(err) {
          if (err) {
            reject(err);
          }
        });
        console.log("value of state.recommendedGames within promise: ", state.recommendedGames);
        resolve(state.recommendedGames);
      });
    },
    retrieveRecommendedGames(state, username) {
      storage.get(username, function(err, data) {
        if (err) {
          console.log("error retrieving recommended games: ", err);
        } else {
          // state.recommendedGames = data;

          //Object.values(state.recommendedGames);
          if (typeof data === "object") {
            state.recommendedGames = Object.values(data);
          } else {
            state.recommendedGames = data;
          }
        }
      });
    },
    removeFromRecommendedGames(state, recoParams) {
      console.log("state.recommendedGames in removeFromRecommendedGames mutation: ", state.recommendedGames);
      // let recommendedGames = Object.values(state.recommendedGames);

      var index;

      for (var i = 0; i < state.recommendedGames.length; i++) {
        if (state.recommendedGames[i].id == recoParams.game.id) {
          index = i;
        }
      }

      // recommendedGames.splice(index, 1);
      //save recommendedGames

      state.recommendedGames.splice(index, 1);

      return new Promise((resolve, reject) => {
        storage.set(recoParams.username, state.recommendedGames, function(err) {
          if (err) {
            reject(err);
          }
        });
        resolve(state.recommendedGames);
      });
      // storage.set(recoParams.username, recommendedGames, function(err) {
      //   if (err) {
      //     console.log("There was an error saving recommendedGames after removal: ", err);
      //   }
      // });
    },
    clearRecommendedGames(state, recoParams) {
      console.log("params for clearing recommended Games: ", recoParams);
      storage.remove(recoParams.username, function(err) {
        console.log("error clearing recommended games: ", err);
      });
    },
    addRecoUserAndGame(state, data) {
      //state.recommendedUserId[userParams.gameId] = userParams.userId;
      //how should user id be added?
      //state.recoUserAndGame.push(userParams.userId);

      if (data == null) {
        state.recoUserAndGame.push(0);
      } else {
        state.recoUserAndGame.push(data);
      }
    },
    removeRecoUserAndGame(state, index) {
      //state.recommendedUserId[userParams.gameId] = null;
      state.recoUserAndGame.splice(index, 1);
    },

    clearRecoUserAndGame(state) {
      state.recoUserAndGame = [];
    },
    addUserRecommendedIdIndex(state, params) {
      console.log("inside addUserRecommendedIdIndex mutation");

      if (params == null) {
        state.recommendedUserIdIndex.push(0);
      } else {
        state.recommendedUserIdIndex.push(params.userId);
      }
      console.log("recommendedUserIdIndex after push: ", state.recommendedUserIdIndex);
    },
    removeUserRecommendedIdIndex(state, index) {
      console.log("index inside removeUserRecommendedIdIndex");

      state.recommendedUserIdIndex.splice(index, 1); //This will just remove whatever is in recommendedUserIdIndex at the same index as the game that was removed
      console.log("recommendedUserIdIndex after splice: ", state.recommendedUserIdIndex);
    },
    clearUserRecommendedIdIndex(state) {
      state.recommendedUserIdIndex = [];
    },
    setVotedGames(state, params) {
      state.votedGames.push(params.game);

      console.log("list of voted games: ", state.votedGames);

      storage.set(params.username, state.votedGames, function(err) {
        if (err) {
          console.log("There was an error trying to save voted games...");
        }
      });
    },
    getVotedGames(state, username) {
      storage.get(username, function(err, data) {
        if (err) {
          console.log("there was an error retrieving voted games: ", err);
        } else {
          state.votedGames = data;
        }
      });
    }
  },
  actions: {
    addToCart(context, game) {
      //console.log(game);
      context.commit("addToCart", game);
    },

    removeFromCart(context, index) {
      console.log("from removeFromCart in index...");
      context.commit("removeFromCart", index);
    },

    clearCart(context) {
      context.commit("clearCart");
    },
    saveCart(context) {
      context.commit("saveCart");
    },
    savePath(context, path) {
      context.commit("savePath", path);
    },
    retrievePath(context) {
      context.commit("retrievePath");
    },
    removePath(context) {
      context.commit("removePath");
    },
    addDownloadedGame(context, savedContent) {
      console.log("game to be added to downloaded array: ", savedContent.game, "path: ", savedContent.path, " in action");
      context.commit("addDownloadedGame", savedContent);
    },
    retrieveDownloadedGame(context) {
      context.commit("retrieveDownloadedGame");
    },
    removeDownloadedGames(context) {
      context.commit("removeDownloadedGames");
    },
    addToRecommendedGames(context, recoParams) {
      context.commit("addToRecommendedGames", recoParams);
    },
    retrieveRecommendedGames(context, username) {
      context.commit("retrieveRecommendedGames", username);
    },
    removeFromRecommendedGames(context, recoParams) {
      context.commit("removeFromRecommendedGames", recoParams);
    },
    clearRecommendedGames(context, recoParams) {
      console.log("recoParams in action: ", recoParams);
      context.commit("clearRecommendedGames", recoParams);
    },
    addRecoUserAndGame(context, data) {
      context.commit("addRecoUserAndGame", data);
    },
    removeRecoUserAndGame(context, index) {
      context.commit("removeRecoUserAndGame", index);
    },
    clearRecoUserAndGame(context) {
      context.commit("clearRecoUserAndGame");
    },
    addUserRecommendedIdIndex(context, params) {
      context.commit("addUserRecommendedIdIndex", params);
    },
    removeUserRecommendedIdIndex(context, index) {
      context.commit("removeUserRecommendedIdIndex", index);
    },
    clearUserRecommendedIdIndex(context, index) {
      context.commit("clearUserRecommendedIdIndex", index);
    },
    setVotedGames(context, params) {
      context.commit("setVotedGames", params);
    },
    getVotedGames(context, username) {
      context.commit("getVotedGames", username);
    },

    async [START_GAME]({ state, getters }, { gameId }) {
      const { game } = state;
      if (!game) {
        throw new Error("No exec file");
      }

      // TODO once file is downloaded to `gameDownloadPath` it needs to be processed with game install script;
      //  the game will be installed to `gameInstalationPath`
      const execFile = fs
        .readdirSync(getters[GAME_INSTALL_PATH](gameId))
        .filter(absPath => path.extname(absPath).toLowerCase() === ".exe")
        .shift();

      if (!execFile) {
        throw new Error("No exec file");
      }

      const gamePath = path.join(getters[GAME_INSTALL_PATH](gameId), execFile);
      if (fs.existsSync(gamePath)) {
        // await child_process.execSync(`chmod -R a+rwx ${gamePath}`);
        return await child_process.spawnSync(gamePath);
        // return shell.openItem(gamePath);
      } else {
        throw new Error("No exec file");
      }
    },

    [UNINSTALL_GAME]({ getters }, { gameId }) {
      return fsExtra.emptyDirSync(getters[GAME_INSTALL_PATH](gameId));
    },

    async [INSTALL_GAME]({ getters }, { gameId }) {
      console.log(`Installing game with id ${gameId} started`);
      const downloadPath = getters[GAME_DOWNLOAD_PATH](gameId);
      const installPath = getters[GAME_INSTALL_PATH](gameId);

      if (!downloadPath) {
        return false;
      }

      const torrent = getters.findTorrentByGameId(gameId);

      let src = [];

      if (torrent) {
        if (torrent.downloaded) {
          src = fs
            .readdirSync(downloadPath)
            .filter(absPath => path.extname(absPath).toLowerCase() === ".zip")
            .map(val => {
              return path.join(downloadPath, val);
            });
        } else {
          throw new Error("Game not downloaded");
        }
      } else {
        src = fs
          .readdirSync(downloadPath)
          .filter(absPath => path.extname(absPath).toLowerCase() === ".zip")
          .map(val => {
            return path.join(downloadPath, val);
          });

        if (!src.length) {
          throw new Error("Nothing to install");
        }
      }

      if (src.length) {
        const unzip = require("extract-zip");

        const errors = [];
        const promises = [];

        src.forEach(file => {
          if (/\.zip$/.test(file)) {
            promises.push(
              new Promise((resolve, reject) => {
                unzip(
                  file,
                  {
                    dir: installPath
                  },
                  err => {
                    console.log("unzip done", file);
                    resolve(file);

                    if (err) {
                      errors.push(err);
                      reject(err);
                      console.error("Unzip error", err);
                    }
                  }
                );
              })
            );
          }
        });

        await Promise.all(promises);

        console.log(`Installing game with id ${gameId} finished`);

        return {
          success: true,
          errors
        };
      }

      return {
        success: false,
        errors: []
      };
    },

    [ADD_TORRENT]({ commit }, data) {
      commit(ADD_TORRENT, data);
    },

    async [UPDATE_GAME]({ state, dispatch }, data) {
      console.log(data);
      await dispatch("getGame", { params: { id: data.id } });

      console.log(state.game);

      if (state.game) {
        state.game.magnetURI = data.magnetURI;
        state.game.sizeBytes = data.sizeBytes;

        Axios({ url: "/games", data: state.game, method: "PUT" })
          .then(resp => {
            console.log(resp);
            dispatch("getGames");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    [ADD_TORRENT_SEED]({ commit, dispatch }, data) {
      commit(ADD_TORRENT_SEED, data);

      const payload = data.payload;

      dispatch(UPDATE_GAME, {
        id: payload.gameId,
        magnetURI: payload.torrentURL,
        sizeBytes: payload.sizeBytes
      });
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

    [UNARCHIVE_OK]({ commit }, data) {
      commit(UNARCHIVE_OK, data);
    },

    [UNARCHIVE_FAIL]({ commit }, data) {
      commit(UNARCHIVE_FAIL, data);
    },

    async [START_SEEDING]({ state, commit }, { gameId }) {
      if (ipcMain) {
        const { dialog } = electron;

        let files = dialog.showOpenDialog({ properties: ["openFile"], filters: [{ name: "Archives", extensions: ["zip"] }] });

        if (!files) {
          return;
        }

        files = files.map(filePath => {
          return {
            path: filePath
          };
        });

        ipcMain.emit(
          "wt-create-torrent",
          null,
          state.nextTorrentKey, // key
          {
            files,
            gameId
          }
        );

        commit(NEXT_TORRENT_KEY_USED);
      }
    },

    async [START_DOWNLOAD_GAME]({ state, commit, getters }, { gameId }) {
      console.log("inside index.js start download game");
      const { findTorrentByGameId } = getters;
      let torrent = findTorrentByGameId(gameId);
      console.log("this is torrent, gotten from findTorrentByGameId: ");
      console.log(torrent);
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

      const user = getters[USER];
      if (!user.username) console.log("TRY AGAIN");
      console.log(`user ${user.username}`);
      console.log("START_DOWNLOAD_GAME");
      let torrentKey;
      // const gameInstallPath = getters[GAME_INSTALL_PATH](gameId);
      // const gameDownloadPath = getters[GAME_DOWNLOAD_PATH](gameId);

      // if (!fs.existsSync(gameDownloadPath)) fs.mkdirSync(gameDownloadPath, { recursive: true });
      // if (!fs.existsSync(gameInstallPath)) fs.mkdirSync(gameInstallPath, { recursive: true });

      if (torrent) {
        ({ torrentKey } = torrent);
        if (torrent.state === "downloading") {
          console.log("state is downloading: exit");
          // nothing to do
          return;
        }
        // await Axios({ url: `/games/${gameId}/stats`, params: { state: 'downloading', torrentKey }, method: 'POST' });
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
        // await Axios({ url: `/games/${gameId}/stats`, params: { state: 'loading-metadata', torrentKey }, method: 'POST' });
        commit(addTorrentMsg);
        torrent = findTorrentByGameId(gameId);
      }

      const { torrentFileName, torrentURL } = torrent;
      const torrentId = torrentFileName || torrentURL;

      const downloadPath = getters[GAME_DOWNLOAD_PATH](gameId);

      if (!ipcRenderer) {
        console.log("ipcRenderer is index js emit");
        ipcMain.emit(
          "wt-start-torrenting",
          null,
          torrentKey, // key
          torrentId,
          downloadPath,
          null
        );
      } else {
        console.log("else in ipcRenderer in index js");
        ipcRenderer.emit(
          "wt-start-torrenting",
          torrentKey, // key
          torrentId,
          downloadPath,
          null
          // select all torrent files by default
        );
      }
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
        } else {
          ipcRenderer.emit("wt-stop-torrenting", infoHash);
        }
      } else {
        // metadata hasn't been parsed yet. when metadata will be received torrent will be paused
      }
    },

    [STOP_TORRENTS]({ state, commit }) {
      state.torrents.forEach(torrent => {
        if (torrent) {
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
            } else {
              ipcRenderer.emit("wt-stop-torrenting", infoHash);
            }
          }
        }
      });

      commit(CLEAR_TORRENTS);
    },

    async [UNARCHIVE_GAME]({ commit, getters }, { gameId }) {
      const { findTorrentByGameId } = getters;
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
          dst: getters[GAME_INSTALL_PATH](gameId)
        });
        return;
      }

      ipcRenderer.emit(UNZIP_GAME, {
        gameId, // s
        src,
        dst: getters[GAME_INSTALL_PATH](gameId)
      });
    }
  },
  plugins: [
    // createPersistedState(),
    createSharedMutations(),
    createPromiseAction()
    // sharedMutation()
  ],
  modules: {
    auth,
    path: storePathModule
  },
  getters: {
    // news: state => {
    //   const news = [];
    //
    //   for (const current of state.demoData.news) {
    //     /**
    //      * @type {({} & {img, releaseDate, publisher, id, text, title}) | any}
    //      */
    //     const normalized = Object.assign({}, current);
    //
    //     if (normalized.id) {
    //       news.push(normalized);
    //
    //       continue;
    //     }
    //
    //     normalized.id = encodeURI(
    //       current.title
    //         .toLowerCase()
    //         .replace(/%/g, "")
    //         .replace(/\s+/g, "_")
    //     );
    //     news.push(normalized);
    //   }
    //
    //   return news;
    // },
    getNewsById: (state, getters) => id => getters.news.filter(elem => elem.id === id).pop(),
    games: state => state.demoData.games,
    // TODO remove getGameById
    getGameById: state => id => state.demoData.games.filter(game => game.id === id).pop(),
    getFilterByName: state => name => {
      if (state.demoData.filters.hasOwnProperty(name)) {
        return state.demoData.filters[name];
      }
      return null;
    },
    getRatingStoreByName: state => name => {
      if (state.demoData.rating.hasOwnProperty(name)) {
        let rating = null;

        if (typeof state.demoData.rating[name] === "object" && !Array.isArray(state.demoData.rating[name])) {
          rating = Object.assign({}, state.demoData.rating[name]);
        } else if (Array.isArray(state.demoData.rating[name])) {
          rating = state.demoData.rating[name].slice(0);
        } else {
          rating = state.demoData.rating[name];
        }

        const { games } = state;

        if (typeof rating === "object") {
          for (const key in rating) {
            if (rating.hasOwnProperty(key)) {
              const result = [];

              if (rating[key].reduce) {
                rating[key].reduce((res, elem) => {
                  const rate = elem.hasOwnProperty("value") ? elem.value : null;
                  const id = Number.parseInt(elem.id);

                  let newElem = games.filter(cur => Number.parseInt(cur.id) === id).pop();

                  if (newElem) {
                    newElem = Object.assign({}, newElem);

                    if (rate) {
                      newElem.rating = rate;
                    }

                    result.push(newElem);
                  }
                }, result);
              } else {
                const newElem = games
                  .filter(cur => {
                    /**
                     * @type {number}
                     */
                    const id = Number.parseInt(rating[key].id);

                    return Number.parseInt(cur.id) === id;
                  })
                  .pop();

                if (newElem) {
                  newElem.rating = rating[key].hasOwnProperty("value") ? rating[key].value : null;
                  rating[key] = newElem;

                  continue;
                }
              }

              rating[key] = result;
            }
          }
        } else if (rating) {
          switch (rating) {
            /**
             * Return all games
             *
             * Need to modify this soo it does not show all games for recommeneded, only shows list of games user recommends
             */
            case "*": {
              rating = games.slice(0); //returns a new object/array starting at 0
              console.log("rating from index.js for ", name, ": ", rating);
              break;
            }

            case "recommendation": {
              console.log("state.recommendedGames: ", state.recommendedGames);
              //rating = Object.values(state.recommendedGames);
              if (state.recommendedGames != null) {
                rating = Object.values(state.recommendedGames);
              } else {
                rating = [];
              }
              break;
            }
          }
        }

        const storeInfo = state.demoData.stores.filter(elem => elem.name === name).pop();

        return {
          sort: storeInfo && storeInfo.sort,
          byField: storeInfo && storeInfo.byField,
          order: storeInfo && storeInfo.order,
          title: storeInfo ? storeInfo.title || name : name,
          content: rating
        };
      }
      const storeInfo = state.demoData.stores.filter(elem => elem.name === name).pop();

      return {
        title: storeInfo ? storeInfo.title || name : name
      };
    },
    findTorrentByGameId: state => id => state.torrents.filter(torrent => torrent.gameId === id).shift(),
    findTorrentByKey: state => key => state.torrents.filter(torrent => torrent.torrentKey === key).shift(),
    findTorrentByMagnetURI: state => magnetURI => state.torrents.filter(torrent => torrent.magnetURI === magnetURI).shift(),
    findTorrentByInfoHash: state => infoHash => state.torrents.filter(torrent => torrent.infoHash === infoHash).shift(),
    isGameDownloaded: (state, getters) => gameId => {
      const torrent = getters.findTorrentByGameId(gameId);
      if (!torrent) {
        return false;
      }
      return torrent.progress && torrent.progress.done;
    },
    getGameDownloadProgress: (state, getters) => gameId => {
      const torrent = getters.findTorrentByGameId(gameId);
      return torrent && torrent.progress ? torrent.progress.progress : 0;
    }
    // getGameDownloadPath: () => gameId => path.join(downloadPath, `${gameId}`),
    // getGameInstallPath: () => gameId => path.join(installPath, `${gameId}`),
  }
};

/**
 * Merge stores
 */
const stores = deepMerge.all([games, news, demoData, users]);

function patchCollectionItemByKey(items, itemPatch, keyName) {
  const needleKey = itemPatch[keyName];
  return items.map(item => {
    if (item[keyName] !== needleKey) {
      return item;
    }
    return { ...item, ...itemPatch };
  });
}

//
// if (ipcMain) {
//   ipcMain.on("GLOBAL_STORE_TEST", (event, GLOBAL_STORE_TEST) => {
//     global.GLOBAL_STORE_TEST = GLOBAL_STORE_TEST;
//   });
// } else if (ipcRenderer) {
//   ipcRenderer.on("GLOBAL_STORE_TEST", (event, GLOBAL_STORE_TEST) => {
//     global.GLOBAL_STORE_TEST = GLOBAL_STORE_TEST;
//   });
// }
//
// console.log(global.GLOBAL_STORE_TEST);
export default new Vuex.Store(stores);
