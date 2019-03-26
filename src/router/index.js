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

// It seems like this code prevents navigating to game page if auth got 401 error
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    let name = null;

    if (from.name === to.name) {
      name = 'home';
    }

    return next({
      name: name || from.name,
      params: name ? {} : from.params,
      query: {
        auth: 'select',
      }
    });
  } else {
    if (!router.app.$auth.check() && to.query.auth) {
      router.app.$authModal.showModal = true;
    }

    return next(true);
  }

  // if (to.meta.hasOwnProperty('auth') && to.meta.auth) {
  //   if (router.app.$auth.check()) {
  //     return next(true);
  //   }
  //

  //
  //   next({
  //     name: name || from.name,
  //     params: name ? {} : from.params,
  //     query: {
  //       auth: 'select',
  //       redirect: to.path,
  //     },
  //   });
  // } else {
  // }
});

export default router;
