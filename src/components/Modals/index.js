import AuthModal from './AuthModal.vue';

const AuthModalStore = {
  showModal: false,
  onAuthorized: false
};

export default {
  install(Vue) {
    const app = new Vue({
      data: { authModalStore: AuthModalStore },
    });

    Vue.prototype.$authModal = app.authModalStore;
    Vue.component('auth-modal', AuthModal);
  },
};
