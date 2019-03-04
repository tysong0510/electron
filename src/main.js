import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

import Vs from 'd3-vs';
import {
  // Flow Of transition
  d3SankeyCircular,

  // Time Serie
  d3Timelion,
  d3Timeline,

  // Basic
  d3Pie,
  d3Line,
  d3Metric,
  d3MultiLine,
  d3HorizontalBar,
  d3VerticalBar,
  d3GroupedArea,
  d3Area,
  d3Circle,

  // Functional
  d3Player,
  d3HorizontalSlider,
  d3VerticalSlider,

  // Layout
  d3Sunburst,
  d3Tree,
  d3Pack,
  d3Cluster,
  d3ICicleVertical,
  d3ICicleHorizontal,

  // Leaflet
  d3LChoropleth,
  d3LHeat
} from 'd3-vs';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import Dashboard from './plugins/dashboard';
import './registerServiceWorker';

import './assets/scss/main.scss';

Vue.use(BootstrapVue);
Vue.use(Dashboard);
Vue.use(VueRouter);

Vue.use(Vs);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
