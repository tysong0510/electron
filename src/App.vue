<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import axios from "axios";
import { ipcRenderer } from "electron";
import { UNAUTHORIZED } from "./dispatch-types";
import user from "./mixins/user";
import { IS_LOGGED_IN } from "./store/modules/auth";

export default {
  mixins: [user],
  created() {
    axios.interceptors.response.use(
      response => response,
      err => {
        if (!err.response) {
          throw err;
        }

        switch (err.response.status) {
          case 401:
            console.log(err.request);
            this.$root.$emit("unauthorized");
            ipcRenderer.send(UNAUTHORIZED);
            return err;
          default:
            throw err;
        }
      }
    );

    this.$root.$on("unauthorized", this.logout); //responsible for application starting with logging people out, has to be removed for remember me....
  },
  mounted() {
    this.$watch("$sidebar.showSidebar", this.toggleNavOpen);

    // if (this.$auth.check()) {
    //   ipcRenderer.send(AUTHORIZED);
    // }
  },
  updated() {
    if (!this[IS_LOGGED_IN] && this.$route.query.auth) {
      this.$root.$emit("bv::show::modal", "modal-authorize");
    }
  },
  methods: {
    toggleNavOpen() {
      const root = document.getElementsByTagName("html")[0];
      root.classList.toggle("nav-open");
    },
    logout() {
      ipcRenderer.send(UNAUTHORIZED);
    }
  }
};
</script>
