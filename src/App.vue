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
  computed: {
    checkIsRemembered() {
      // if(this.$store.state.isRemembered != null) {
      // console.log("inside computed, isRemembered is not null");
      // var userCredentials = this.$store.isRemembered;
      // console.log("userCredentials gotten from isRemembered: ", userCredentials);
      // //this.$store.dispatch("autoLogin", userCredentials);

      // this.$store
      //   .dispatchPromise(ACTION_LOGIN, { //should include remember me in here to be checked in auth.js to register remember me
      //     username: this.username,
      //     password: this.password,
      //     rememberMe: this.rememberMe
      //   })
      //   .then(() => {
      //     this.loading = false;
      //     this.$authModal.showModal = false;

      //     console.log("Authorized");

      //     this.formReset();

      //     // ipcRenderer.send(AUTHORIZED);

      //     if (!this.$route.query["no-redirect"]) {
      //       this.$router.push(this.$route.query.redirect || { name: "profile" });
      //     }

      //     this.$root.$emit("authorized");
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //     console.log(err);

      //     const res = err && err.response;

      //     if (res && res.status === 404) {
      //       this.loginValid = false;
      //     } else if (res && res.status == 401) {
      //       this.emailValid = false;
      //     } else {
      //       this.otherError = true;
      //     }
      //   });
      //}
      var rand = "testing from computed...";
      return rand;
    }
  },
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
