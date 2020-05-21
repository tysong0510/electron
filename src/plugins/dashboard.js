import SideBar from "@/components/SideBar";
import AuthModal from "@/components/Modals";
//import ShoppingCart from "../pages/ShoppingCart.vue";
import ShoppingCart from "@/components/Modals";

export default {
  install(Vue) {
    Vue.use(SideBar);
    Vue.use(AuthModal);
    Vue.use(ShoppingCart); //using as a plugin?
  }
};
