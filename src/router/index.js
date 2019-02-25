import VueRouter from 'vue-router';

import routes from './routes';

export default new VueRouter({
  routes,
  linkExactActiveClass: 'active',

  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    }

    return { x: 0, y: 0 };
  },
});
