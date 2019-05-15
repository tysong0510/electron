<template>
  <component :is="tag" :class="`nav-item icon-${icon}`" v-bind="$attrs" tag="li" @click.native="hideSidebar">
    <a class="nav-link">
      <slot>
        <p>{{ name }}</p>
      </slot>
    </a>
  </component>
</template>

<script>
export default {
  name: "SidebarLink",
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
      default: "router-link"
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
  },
  methods: {
    hideSidebar() {
      if (this.autoClose) {
        this.$sidebar.displaySidebar(false);
      }
    },
    isActive() {
      return this.$el.classList.contains("active");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
li.icon-store:before {
  background-image: url("../../assets/icons/store.svg");
}
li.icon-game:before {
  background-image: url("../../assets/icons/game.svg");
}
li.icon-user:before {
  background-image: url("../../assets/icons/user.svg");
}
li.icon-news:before {
  background-image: url("../../assets/icons/news.svg");
}

ul > li:before {
  content: "";
  height: 1.1em;
  width: 1.1em;
  display: block;
  float: left;
  margin-top: 0.8em;
  margin-right: 1.5em;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.5;
}

ul > li.active:before {
  opacity: 1;
}

.nav-link > p {
  letter-spacing: 0.05em;
}
</style>
