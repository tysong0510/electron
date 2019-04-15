<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { AUTHORIZED, UNAUTHORIZED } from './dispatch-types';

export default {
  created() {
    axios.interceptors.response.use(
      response => response,
      (err) => {
        if (!err.response) {
          throw err;
        }

        switch (err.response.status) {
          case 401:
            this.$root.$emit('unauthorized');
            ipcRenderer.send(UNAUTHORIZED);
            return err;
          default:
            throw err;
        }
      },
    );
    // this.$root.$on('unauthorized', this.logout); // TODO revert, fix auth flow on Game Buy button
  },
  mounted() {
    this.$watch('$sidebar.showSidebar', this.toggleNavOpen);

    if (this.$auth.check()) {
      ipcRenderer.send(AUTHORIZED);
    }
  },
  updated() {
    if (!this.$auth.check() && this.$route.query.auth) {
      this.$root.$emit('bv::show::modal', 'modal-authorize');
    }

    this.authenticated();
  },
  methods: {
    toggleNavOpen() {
      const root = document.getElementsByTagName('html')[0];
      root.classList.toggle('nav-open');
    },
    authenticated() {
      if (this.$auth.check()) {
        ipcRenderer.send(AUTHORIZED);
      } else {
        ipcRenderer.send(UNAUTHORIZED);
      }
    },
    logout() {
      this.$auth.logout({
        method: 'get',
        makeRequest: true,
        redirect: false
      });

      ipcRenderer.send(UNAUTHORIZED);
    },
  },
};
</script>
