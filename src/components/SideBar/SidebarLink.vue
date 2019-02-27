<template>
  <component :is="tag"
             @click.native="hideSidebar"
             :class="`nav-item icon-${icon}`"
             v-bind="$attrs"
             tag="li">
    <a class="nav-link">
      <slot>
        <p>{{name}}</p>
      </slot>
    </a>
  </component>
</template>

<script>
  export default {
    name: 'sidebar-link',
    inheritAttrs: false,
    inject: {
      autoClose: {
        default: true
      },
      addLink: {
        default: () => {}
      },
      removeLink: {
        default: () => {}
      }
    },
    props: {
      name: String,
      icon: String,
      tag: {
        type: String,
        default: 'router-link'
      }
    },
    methods: {
      hideSidebar() {
        if (this.autoClose) {
          this.$sidebar.displaySidebar(false);
        }
      },
      isActive() {
        return this.$el.classList.contains('active');
      }
    },
    mounted() {
      if (this.addLink) {
        this.addLink(this);
      }
    },
    beforeDestroy() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
      if (this.removeLink) {
        this.removeLink(this);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  li.icon-store:before {
    background-image: url('../../assets/icons/store.svg');
  }
  li.icon-game:before {
    background-image: url('../../assets/icons/game.svg');
  }
  li.icon-user:before {
    background-image: url('../../assets/icons/user.svg');
  }
  li.icon-news:before {
    background-image: url('../../assets/icons/news.svg');
  }

  ul > li:before {
    content: '';
    height: 1.1em;
    width: 1.1em;
    display: block;
    float: left;
    margin-top: 1em;
    margin-right: 1.5em;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
</style>
