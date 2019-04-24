import Axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { ipcMain, ipcRenderer } from 'electron';
import { baseURL } from '../../apiConfig';
import { AUTHORIZED, UNAUTHORIZED } from '../../dispatch-types';
import { State } from '../../state';
import { restoreStoreFromSavedUserState } from '../../state-restore';
import { CLEAR_TORRENTS } from '../mutation-types';

export const MUTATION_AUTH_REQUEST = 'MUTATION_AUTH_REQUEST';
export const MUTATION_AUTH_SUCCESS = 'MUTATION_AUTH_SUCCESS';
export const MUTATION_AUTH_ERROR = 'MUTATION_AUTH_ERROR';
export const MUTATION_AUTH_USER = 'MUTATION_AUTH_USER';
export const MUTATION_AUTH_TOKEN = 'MUTATION_AUTH_TOKEN';
export const MUTATION_LOGOUT = 'MUTATION_LOGOUT';
export const MUTATION_CLEAR_REFRESH_INTERVAL = 'MUTATION_CLEAR_REFRESH_INTERVAL';
export const MUTATION_SET_REFRESH_INTERVAL = 'MUTATION_SET_REFRESH_INTERVAL';

export const ACTION_LOGIN = 'ACTION_LOGIN';
export const ACTION_REGISTER = 'ACTION_REGISTER';
export const ACTION_LOGOUT = 'ACTION_LOGOUT';
export const ACTION_USER = 'ACTION_USER';
export const ACTION_REFRESH = 'ACTION_REFRESH';

export const USER = 'USER';
export const IS_LOGGED_IN = 'IS_LOGGED_IN';
export const AUTH_STATUS = 'AUTH_STATUS';
export const REFRESH_INTERVAL = 'REFRESH_INTERVAL';

let intervalId = null;

/** Set axios baseUrl */
Axios.defaults.baseURL = baseURL;

Vue.use(Vuex);

export default {
  state: {
    status: '',
    token: '',
    authorized: false,
    user: {},
    refreshInterval: 30,
  },
  mutations: {
    [MUTATION_AUTH_REQUEST](state) {
      state.status = 'loading';
    },
    [MUTATION_AUTH_SUCCESS](state) {
      state.status = 'success';
      state.authorized = true;
      // state.token = token;

      if (ipcMain) {
        ipcMain.emit(AUTHORIZED);
      } else if (ipcRenderer) {
        ipcRenderer.emit(AUTHORIZED);
        // ipcRenderer.send(AUTHORIZED);
      }
    },
    [MUTATION_AUTH_TOKEN](state, token) {
      Axios.defaults.headers.common.authorization = token;

      state.token = token;
    },
    [MUTATION_AUTH_ERROR](state, err) {
      state.status = 'error';
      state.token = '';
      state.user = {};

      console.log(MUTATION_AUTH_ERROR, err);

      if (ipcMain) {
        ipcMain.emit(UNAUTHORIZED);
      } else if (ipcRenderer) {
        // ipcRenderer.send(UNAUTHORIZED);
        ipcRenderer.emit(UNAUTHORIZED);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [MUTATION_AUTH_USER](state, user) {
      state.user = user;

      if (ipcMain) {
        ipcMain.emit(MUTATION_AUTH_USER);
      }
    },
    [MUTATION_CLEAR_REFRESH_INTERVAL]() {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [MUTATION_SET_REFRESH_INTERVAL](state, interval) {
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = interval;
    },
    [MUTATION_LOGOUT](state, err) {
      state.status = '';
      state.token = '';
      state.user = {};

      console.log(MUTATION_LOGOUT, err);

      clearInterval(intervalId);
    },
  },
  actions: {
    [ACTION_LOGIN](store, user) {
      const { commit, dispatch, getters } = store;
      return new Promise((resolve, reject) => {
        commit(MUTATION_AUTH_REQUEST);

        Axios({ url: '/auth/login', params: user, method: 'POST' })
          .then(async (resp) => {
            const token = resp.headers.authorization;

            commit(MUTATION_AUTH_TOKEN, token);

            const { username } = await dispatch(ACTION_USER);
            commit(MUTATION_AUTH_SUCCESS);
            commit(
              MUTATION_SET_REFRESH_INTERVAL,
              setInterval(() => dispatch(ACTION_REFRESH), getters[REFRESH_INTERVAL]),
            );

            const savedState = await State.loadUser(username);
            await restoreStoreFromSavedUserState(store, savedState);
            resolve(resp);
          })
          .catch((err) => {
            console.log('Error request', err);
            console.log('Error request', err.request);

            commit(MUTATION_AUTH_ERROR);

            reject(err);
          });
      });
    },
    [ACTION_USER]({ commit }) {
      return new Promise((resolve, reject) => {
        Axios({ url: '/auth/user', method: 'GET' })
          .then((resp) => {
            const { data } = resp.data;
            commit(MUTATION_AUTH_USER, data);
            resolve(data);
          })
          .catch((err) => {
            console.log('Error request', err);
            console.log('Error request', err.request);

            commit(MUTATION_LOGOUT, err);

            reject(err);
          });
      });
    },
    [ACTION_REFRESH]({
      commit, state, dispatch, getters,
    }) {
      console.log('Refresh auth token');

      return new Promise((resolve, reject) => {
        Axios({
          url: '/auth/refresh',
          headers: {
            authorization: state.token,
          },
          method: 'GET',
        })
          .then(async (resp) => {
            const token = resp.headers.authorization;

            commit(MUTATION_AUTH_TOKEN, token);

            await dispatch(ACTION_USER);

            commit(MUTATION_AUTH_SUCCESS);

            if (ipcMain) {
              commit(
                MUTATION_SET_REFRESH_INTERVAL,
                setInterval(() => dispatch(ACTION_REFRESH), getters[REFRESH_INTERVAL]),
              );
            }

            resolve(resp);
          })
          .catch((err) => {
            console.log('Error request', err);

            commit(MUTATION_AUTH_ERROR, err);

            reject(err);
          });
      });
    },
    [ACTION_REGISTER](store, user) {
      return new Promise((resolve, reject) => {
        // commit(MUTATION_AUTH_REQUEST);

        Axios({ url: '/auth/register', data: user, method: 'POST' })
          .then((resp) => {
            console.log(resp);
            // const token = resp.data.authorization;
            // const { user } = resp.data;

            // Axios.defaults.headers.common.authorization = token;
            // commit(MUTATION_AUTH_SUCCESS, token, user);
            resolve(resp);
          })
          .catch((err) => {
            // commit(MUTATION_AUTH_ERROR, err);

            reject(err);
          });
      });
    },
    [ACTION_LOGOUT]({ commit }) {
      return new Promise((resolve) => {
        // Stop all torrents and clear state
        console.log('sending wt-reset on logout');
        (ipcMain || ipcRenderer).send('wt-reset');
        commit(CLEAR_TORRENTS);

        commit(MUTATION_LOGOUT, ACTION_LOGOUT);

        delete Axios.defaults.headers.common.authorization;

        if (ipcMain) {
          ipcMain.emit(UNAUTHORIZED);
        } else if (ipcRenderer) {
          ipcRenderer.emit(UNAUTHORIZED);
        }

        resolve();
      });
    },
  },
  getters: {
    [IS_LOGGED_IN](state) {
      return !!state.token && state.authorized;
    },
    [AUTH_STATUS](state) {
      return state.status;
    },
    [USER](state) {
      return state.user;
    },
    [REFRESH_INTERVAL](state) {
      return state.interval ? state.interval * 1000 : 30000;
    },
  },
};
