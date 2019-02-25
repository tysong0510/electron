<template>
  <div class="wrapper">
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
    </div>
  </div>
</template>

<style lang="scss"></style>

<script>
import DashboardContent from './Content.vue';

export default {
  components: {
    // TopNavbar,
    // ContentFooter,
    DashboardContent,
    // MobileMenu
  },
  methods: {
    // toggleSidebar() {
    //   if (this.$sidebar.showSidebar) {
    //     this.$sidebar.displaySidebar(false);
    //   }
    // }
  }
};
</script>
