import Axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import {baseURL} from "../../apiConfig";
import { ipcMain } from 'electron';
import {AUTHORIZED, UNAUTHORIZED} from "../../dispatch-types";

export const MUTATION_AUTH_REQUEST = 'MUTATION_AUTH_REQUEST';
export const MUTATION_AUTH_SUCCESS = 'MUTATION_AUTH_SUCCESS';
export const MUTATION_AUTH_ERROR = 'MUTATION_AUTH_ERROR';
export const MUTATION_AUTH_USER = 'MUTATION_AUTH_USER';
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

Vue.use(Vuex);

export default {
  state: {
    status: '',
    token: '',
    user: {},
    refreshInterval: 30
  },
  mutations: {
    [MUTATION_AUTH_REQUEST](state) {
      state.status = 'loading';
    },
    [MUTATION_AUTH_SUCCESS](state, token) {
      state.status = 'success';
      state.token = token;

      if (ipcMain) {
        ipcMain.emit(AUTHORIZED);
      }
    },
    [MUTATION_AUTH_ERROR](state, err) {
      state.status = 'error';
      state.token = '';
      state.user = {};

      console.log(MUTATION_AUTH_ERROR, err);

      if (ipcMain) {
        ipcMain.emit(UNAUTHORIZED);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [MUTATION_AUTH_USER](state, user) {
      state.user = user;
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

      if (ipcMain) {
        ipcMain.emit(UNAUTHORIZED);
      }

      clearInterval(intervalId);
    },
  },
  actions: {
    [ACTION_LOGIN]({commit, dispatch, getters}, user) {
      return new Promise((resolve, reject) => {
        commit(MUTATION_AUTH_REQUEST);

        Axios({url: `${baseURL}/auth/login`, params: user, method: 'POST'})
          .then(resp => {
            const token = resp.headers.authorization;

            Axios.defaults.headers.common['authorization'] = token;
            commit(MUTATION_AUTH_SUCCESS, token);
            commit(MUTATION_SET_REFRESH_INTERVAL, setInterval(() => dispatch(ACTION_REFRESH), getters[REFRESH_INTERVAL]));
            dispatch(ACTION_USER);

            resolve(resp);
          })
          .catch(err => {
            console.log("Error request", err);
            console.log("Error request", err.request);

            commit(MUTATION_AUTH_ERROR);

            reject(err);
          })
      });
    },
    [ACTION_USER]({commit}) {
      return new Promise((resolve, reject) => {
        Axios({url: `${baseURL}/auth/user`, method: 'GET'})
          .then(resp => {
            commit(MUTATION_AUTH_USER, resp.data.data);

            resolve(resp);
          })
          .catch(err => {
            console.log("Error request", err);
            console.log("Error request", err.request);

            commit(MUTATION_LOGOUT, err);

            reject(err);
          });
      });
    },
    [ACTION_REFRESH]({commit, state, dispatch, getters}) {
      console.log('Refresh auth token');

      return new Promise((resolve, reject) => {
        Axios({
          url: `${baseURL}/auth/refresh`,
          headers: {
            authorization: state.token
          },
          method: 'GET'
        })
          .then(resp => {
            const token = resp.headers.authorization;

            Axios.defaults.headers.common['authorization'] = token;
            commit(MUTATION_AUTH_SUCCESS, token);
            commit(MUTATION_SET_REFRESH_INTERVAL, setInterval(() => dispatch(ACTION_REFRESH), getters[REFRESH_INTERVAL]));
            dispatch(ACTION_USER);

            resolve(resp);
          })
          .catch(err => {
            console.log("Error request", err);

            commit(MUTATION_AUTH_ERROR, err);

            reject(err);
          });
      });
    },
    [ACTION_REGISTER]({commit}, user) {
      return new Promise((resolve, reject) => {
        commit(MUTATION_AUTH_REQUEST);

        Axios({url: `${baseURL}/auth/register`, data: user, method: 'POST'})
          .then(resp => {
            const token = resp.data.authorization;
            const user = resp.data.user;

            Axios.defaults.headers.common['authorization'] = token;
            commit(MUTATION_AUTH_SUCCESS, token, user);
            resolve(resp);
          })
          .catch(err => {
            commit(MUTATION_AUTH_ERROR, err);

            reject(err);
          });
      });
    },
    [ACTION_LOGOUT]({commit}) {
      return new Promise((resolve) => {
        commit(MUTATION_LOGOUT, ACTION_LOGOUT);

        delete Axios.defaults.headers.common['authorization'];

        resolve();
      });
    }
  },
  getters: {
    [IS_LOGGED_IN](state) {
      return !!state.token;
    },
    [AUTH_STATUS](state) {
      return state.status;
    },
    [USER](state) {
      return state.user;
    },
    [REFRESH_INTERVAL](state) {
      return state.interval ? state.interval * 1000 : 30000;
    }
  }
}
