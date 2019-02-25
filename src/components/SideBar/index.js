import Sidebar from './SideBar.vue';
import SidebarLink from './SidebarLink.vue';

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  displaySidebar(value) {
    this.showSidebar = value;
  }
};

export default {
  install(Vue) {
    const app = new Vue({
      data: { sidebarStore: SidebarStore },
    });

    Vue.prototype.$sidebar = app.sidebarStore;
    Vue.component('side-bar', Sidebar);
    Vue.component('sidebar-link', SidebarLink);
  }
};
