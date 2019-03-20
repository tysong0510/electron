import SideBar from '@/components/SideBar';
import AuthModal from '@/components/Modals';

export default {
  install(Vue) {
    Vue.use(SideBar);
    Vue.use(AuthModal);
  },
};
