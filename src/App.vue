<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
  import axios from 'axios';

  export default {
    methods: {
      toggleNavOpen() {
        let root = document.getElementsByTagName('html')[0];
        root.classList.toggle('nav-open');
      },
      logout() {
        if (localStorage.auth) {
          localStorage.removeItem('auth');
        } else  {
          localStorage.auth = 1;
        }
      }
    },
    created() {
      axios.interceptors.response.use(
        response => response,
        err => {
          switch (err.response.status) {
            case 401:
              this.$root.$emit('unauthorized');
              return err;
            default:
              throw err;
          }
        }
      );

      this.$root.$on('unauthorized', this.logout);
    },
    mounted() {
      this.$watch('$sidebar.showSidebar', this.toggleNavOpen);
    },
    updated() {
      if (!localStorage.auth && this.$route.query.auth) {
        this.$root.$emit('bv::show::modal','modal-authorize');
      }
    }
  };
</script>
