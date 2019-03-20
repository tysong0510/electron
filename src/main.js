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
  render: h => h(App),
}).$mount('#app');
