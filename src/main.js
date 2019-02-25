import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import Dashboard from './plugins/dashboard';
import './registerServiceWorker';

import './assets/scss/base.scss';

Vue.use(BootstrapVue);
Vue.use(Dashboard);
Vue.use(VueRouter);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
