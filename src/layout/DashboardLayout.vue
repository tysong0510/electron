<template>
  <div class="wrapper">
    <!--<div v-for="(group, name) in groups">-->
    <!--<a v-text="group.name"></a>-->
    <!--<ul>-->
    <!--<li v-for="item in group.items" v-text="item"></li>-->
    <!--</ul>-->
    <!--<hr>-->
    <!--</div>-->
    <side-bar>
      <template slot="links">
        <sidebar-link
          to="/store"
          :name="$t('sidebar.store')"
          icon="store"
        />
        <sidebar-link
          to="/games"
          :name="$t('sidebar.userGames')"
          icon="game"
        />
        <sidebar-link
          to="/profile"
          :name="$t('sidebar.userProfile')"
          icon="user"
        />
        <sidebar-link
          to="/news"
          :name="$t('sidebar.news')"
          icon="news"
        />
      </template>
    </side-bar>
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar" />
    </div>

    <auth-modal v-once />
  </div>
</template>

<script>
import DashboardContent from './Content.vue';
// import AuthModal from '../components/Modals/AuthModal.vue';

export default {
  components: {
    // AuthModal,
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
