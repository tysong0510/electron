import VueRouter from 'vue-router';

import routes from './routes';

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active',

  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    }

    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.hasOwnProperty('requireAuth') && to.meta.requireAuth) {
    if (localStorage.auth) {
      return next(true);
    }

    let name = null;

    if (from.name === to.name) {
      name = 'home';
    }

    next({
      name: name || from.name,
      params: name ? {} : from.params,
      query: {
        auth: 'select',
        redirect: to.path,
      },
    });
  } else {
    return next(true);
  }
});

export default router;
