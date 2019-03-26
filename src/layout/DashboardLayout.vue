<template>
  <div :class="['wrapper', collapsed ? 'sidebar-collapsed' : '']">
    <!--<div v-for="(group, name) in groups">-->
    <!--<a v-text="group.name"></a>-->
    <!--<ul>-->
    <!--<li v-for="item in group.items" v-text="item"></li>-->
    <!--</ul>-->
    <!--<hr>-->
    <!--</div>-->
    <sidebar-menu :menu="menu" width="290px" :collapsed="collapsed" @collapse="onCollapse" />
    <!--<side-bar>-->
    <!--<template slot="links">-->
    <!--<sidebar-link-->
    <!--to="/store"-->
    <!--:name="$t('sidebar.store')"-->
    <!--icon="store"-->
    <!--/>-->
    <!--<sidebar-link-->
    <!--to="/games"-->
    <!--:name="$t('sidebar.userGames')"-->
    <!--icon="game"-->
    <!--/>-->
    <!--<sidebar-link-->
    <!--to="/profile"-->
    <!--:name="$t('sidebar.userProfile')"-->
    <!--icon="user"-->
    <!--/>-->
    <!--<sidebar-link-->
    <!--to="/news"-->
    <!--:name="$t('sidebar.news')"-->
    <!--icon="news"-->
    <!--/>-->
    <!--</template>-->
    <!--</side-bar>-->
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar" />
    </div>

    <auth-modal v-once />
  </div>
</template>

<script>
  import DashboardContent from './Content.vue';
  import Logo from '../components/SideBar/Logo.vue';
  // import AuthModal from '../components/Modals/AuthModal.vue';

  export default {
    components: {
      // AuthModal,
      DashboardContent,
      // eslint-disable-next-line
      Logo
    },
    data() {
      return {
        menu: [
          {
            header: true,
            title: 'VoxPop',
            component: Logo,
            visibleOnCollapse: true
          },
          {
            title: 'Store',
            icon: 'icon icon-store',
            href: '/store',
            child: [
              {
                href: '/store/top',
                title: 'Top',
              },
              {
                href: '/store/featured',
                title: 'Featured',
              },
              {
                href: '/store/all',
                title: 'All',
              }
            ]
          },
          {
            href: '/games',
            title: 'My Games',
            icon: 'icon icon-game',
          },
          {
            href: '/profile',
            title: 'Profile',
            icon: 'icon icon-user',
            child: [
              {
                href: '/profile/top-games',
                title: 'My top games',
              },
              {
                href: '/profile/files',
                title: 'My files',
              },
              {
                href: '/profile/recommendation',
                title: 'My recommendation',
              },
              {
                href: '/profile/recently-played',
                title: 'Recently played',
              }
            ]
            // badge: {
            //     text: 'new',
            //     // class:''
            // }
          },
          {
            href: '/news',
            title: 'News',
            icon: 'icon icon-news',
            /*
            disabled: true
            badge: {
                text: 'new',
                // class:''
            }
            */
          },
        ],
        sidebarCollapsed: false
      }
    },
    computed: {
      collapsed: {
        get() {
          return this.sidebarCollapsed;
        },
        set(value) {
          this.sidebarCollapsed = value;
          localStorage.setItem('collapsed', value);
        }
      }
    },
    created() {
      this.collapsed = JSON.parse(localStorage.getItem('collapsed'));
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      onCollapse(collapsed) {
        this.collapsed = collapsed;
      }
    },
  };
</script>

<style scoped lang="scss">
  /deep/ .v-sidebar-menu {
    .first-item {
      > .vsm-link {
        > .vsm-title {
          text-transform: uppercase;
        }

        > .vsm-icon {
          background-color: transparent !important;
          margin-top: -0.09em;
        }
      }
    }

    .vsm-mobile-bg {
      background-color: #151a2d;
    }

    .vsm-arrow {
      transition: ease-in-out 0.2s;
      /*text-align: center;*/

      &:after {
        /*margin: auto!important;*/
        content: " ";
        height: 0.5em;
        width: 0.5em;
        display: block;
        border-top: 1px solid;
        border-right: 1px solid;
        transform: matrix(1, 1, -1, 1, 0, 0);
      }

      &.open-arrow {
        transform: translateY(-50%) translateX(-30%) rotate(90deg);
        margin-top: 0.4em;
      }
    }

    .vsm-item {
      &.first-item {
        &.open-item > .vsm-link {
          background-color: transparent !important;
          box-shadow: inset -3px 0 0 0 white;
        }

        &.active-item > .vsm-link {
          background-color: transparent !important;
          box-shadow: inset -3px 0 0 0 white;
        }
      }
    }

    &:not(.vsm-collapsed) .vsm-dropdown {
      .vsm-list {
        padding-left: 45px;
      }
    }

    .collapse-btn {
      background-color: #141E30;

      &:hover {
        background-color: #151a2d;
      }

      &:after {
        content: "\21C7";
      }
    }

    &.vsm-collapsed {
      .collapse-btn {
        &:after {
          content: "\21C9";
        }
      }
    }

    .vsm-dropdown {
      > .vsm-list {
        background-color: #06091E;
      }
    }

    .vsm-arrow {
      /*background-color: white;*/
    }

    .vsm-link {
      &:hover {
        background-color: #141E30 !important;
      }

      .icon.icon-store:before {
        background-image: url('../assets/icons/store.svg');
      }

      .icon.icon-game:before {
        background-image: url('../assets/icons/game.svg');
      }

      .icon.icon-user:before {
        background-image: url('../assets/icons/user.svg');
      }

      .icon.icon-news:before {
        background-image: url('../assets/icons/news.svg');
      }

      .icon:before {
        content: '';
        height: 100%;
        width: 100%;
        display: block;
        float: left;
        background-color: transparent;
        /*margin-top: 0.8em;*/
        /*margin-right: 1.5em;*/
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.5;
      }

      &.router-link-active {
        .icon:before {
          opacity: 1;
        }
      }
    }
  }

</style>
