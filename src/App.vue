<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
  export default {
    methods: {
      toggleNavOpen() {
        let root = document.getElementsByTagName('html')[0];
        root.classList.toggle('nav-open');
      }
    },
    mounted() {
      this.$watch('$sidebar.showSidebar', this.toggleNavOpen)
    }
  };
</script>
