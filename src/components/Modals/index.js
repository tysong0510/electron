import AuthModal from "./AuthModal.vue";
//import ShoppingCart from "../../pages/ShoppingCart.vue";
//import ShoppingCart from "./ShoppingCart.vue";

const AuthModalStore = {
  showModal: false,
  forceSelect: true,
  onAuthorized: false
};

/*const ShoppingCartStore = {
  showModal: false,
  forceSelect: true,
  onAuthorized: false
}*/

export default {
  install(Vue) {
    const app = new Vue({
      data: { authModalStore: AuthModalStore }
      //dataShoppingCart: { shoppingCartStore: ShoppingCartStore }
    });

    Vue.prototype.$authModal = app.authModalStore;
    Vue.component("auth-modal", AuthModal);

    /*Vue.prototype.$shoppingCart = app.shoppingCartStore;
    Vue.component("shopping-cart", ShoppingCart); //component to use in dashboard layout*/
  }
};
