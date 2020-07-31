import VueRouter from "vue-router";

import routes from "./routes";
import store from "../store";
import { IS_LOGGED_IN } from "../store/modules/auth";

const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",

  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    }

    return { x: 0, y: 0 };
  }
});

// It seems like this code prevents navigating to game page if auth got 401 error
router.beforeEach((to, from, next) => {
  // console.log("to: ", to);
  // console.log("from: ", from);
  // console.log("next: ", next);
  // console.log("is user logged in: ", router.app.$store.getters[IS_LOGGED_IN]);
  // console.log("to.query.auth: ", to.query.auth);

  if (to.name === "login") {
    console.log("to.name is login");
    let name = null;

    if (from.name === to.name) {
      name = "home";
    }

    console.log(
      "next: ",
      next({
        name: name || from.name,
        params: name ? {} : from.params,
        query: {
          auth: "select"
        }
      })
    );

    return next({
      name: name || from.name,
      params: name ? {} : from.params,
      query: {
        auth: "select"
      }
    });
  }

  if (!router.app.$store.getters[IS_LOGGED_IN] && to.query.auth) {
    //console.log("user is not allowed");
    console.log("show the auth modal to login...");
    router.app.$authModal.showModal = true;
  }

  if (to.matched.some(record => record.meta.auth)) {
    if (store.getters[IS_LOGGED_IN]) {
      next();
      return;
    }

    router.app.$authModal.showModal = true;

    if (!from.name) {
      return next({ name: "home" });
    }

    return next(false);
  }

  return next(true);

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
