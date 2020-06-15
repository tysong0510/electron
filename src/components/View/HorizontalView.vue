<template>
  <b-row :class="`horizontal-view ${$attrs.class}`">
    <b-col>
      <slot name="header">
        <b-row>
          <slot name="title">
            <b-col>
              <component :is="titleTag" :class="titleClass">
                {{ title }}
              </component>
            </b-col>
          </slot>
          <slot name="view-all">
            <b-col>
              <b-link :href="viewAllUrl" class="float-right view-all">
                {{ viewAllText }}
              </b-link>
            </b-col>
          </slot>
        </b-row>
      </slot>

      <b-row class="horizontal-view-items">
        <slot />
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "HorizontalView",
  props: {
    title: {
      type: String,
      default: ""
    },
    titleTag: {
      type: String,
      default: "h3"
    },
    titleClass: {
      type: String,
      default: ""
    },
    viewAllTo: {
      type: [String, Object],
      required: true
    },
    viewAllText: {
      type: String,
      default: "View all"
    }
  },
  computed: {
    viewAllUrl: {
      get() {
        console.log("view all url from horizontal view: ", this.$router);
        return this.$router.resolve(this.viewAllTo).href;
      }
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.view-all {
  color: #696e80;
}
</style>
