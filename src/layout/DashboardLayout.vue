<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/store" :name="$t('sidebar.store')" />
        <sidebar-link to="/games" :name="$t('sidebar.userGames')" />
        <sidebar-link to="/profile" :name="$t('sidebar.userProfile')" />
        <sidebar-link to="/news" :name="$t('sidebar.news')" />
      </template>
    </side-bar>
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar" />
    </div>
  </div>
</template>

<script>
  import DashboardContent from './Content.vue';

  export default {
    components: {
      DashboardContent
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    }
  };
</script>
