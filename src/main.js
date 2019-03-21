// import devtools from '@vue/devtools'
import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import Vs from 'd3-vs';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueProgress from 'vue-progress-path';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import Dashboard from './plugins/dashboard';
import { baseURL, authConfig } from './apiConfig';
// import bearer from './drivers/auth/bearer.js';

import { UPDATE_TORRENT } from './store/mutation-types';
import './registerServiceWorker';

Vue.use(VueProgress);

Vue.router = router;

Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = baseURL;

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  ...authConfig});

import './assets/scss/main.scss';

/* import test from './fs';
test.test(); */

Vue.use(BootstrapVue);
Vue.use(Dashboard);
Vue.use(VueRouter);

Vue.use(Vs);

new Vue({
  router,
  store,
  i18n,
  mounted() {
    // Prevent blank screen in Electron builds
    this.$router.push('/')
  },
  render: h => h(App),
}).$mount('#app');

import electron from 'electron';
import { State } from './state';
import { STATE_SAVE, STATE_SAVE_IMMEDIATE } from './dispatch-types';

const { ipcRenderer } = electron;
// Save is restored on app load and saved before quitting
let state;

const dispatchHandlers = {
  [STATE_SAVE]: () => State.save(state),
  [STATE_SAVE_IMMEDIATE]: () => State.saveImmediate(state),
}

function dispatch (action, ...args) {
  const handler = dispatchHandlers[action]
  if (handler) handler(...args)
  else console.error('Missing dispatch handler: ' + action)
}

ipcRenderer.on('wt-error', (e, torrentKey, message) => {
  console.error('wt-error',torrentKey, message);
  // const torrent = store.getters.findTorrentByKey(torrentKey);
  // const { state } = torrent;
  store.commit({
    type: UPDATE_TORRENT,
    torrentKey,
    state: 'error',
    errorMessage: message
  });
});

ipcRenderer.on('dispatch', (e, ...args) => dispatch(...args))
State.on('stateSaved', () => ipcRenderer.send('stateSaved'))

State.load().then((s) => { state = s; console.log('main renderer state', s); });
