<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import axios from 'axios';

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
            return err;
          default:
            throw err;
        }
      },
    );

    this.$root.$on('unauthorized', this.logout);
  },
  mounted() {
    this.$watch('$sidebar.showSidebar', this.toggleNavOpen);
  },
  updated() {
    if (!this.$auth.check() && this.$route.query.auth) {
      this.$root.$emit('bv::show::modal', 'modal-authorize');
    }
  },
  methods: {
    toggleNavOpen() {
      const root = document.getElementsByTagName('html')[0];
      root.classList.toggle('nav-open');
    },
    logout() {
      this.$auth.logout({
        makeRequest: false,
        redirect: false
      });
    },
  },
};
</script>
