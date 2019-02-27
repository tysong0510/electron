<template>
  <div class="store-block">
    <b-container :fluid="fluid">
      <b-row :id="id">
        <b-col>
          <b-row class="controls">
            <b-col>
              <h3 class="title">
                {{ title }}
              </h3>
            </b-col>
            <b-col>
              <b-select class="filter-period" :options="filter.options" v-model="filterSelected">
              </b-select>
            </b-col>
            <b-col class="offset-6" v-if="controls">
              <b-button-group class="d-flex m-auto">
                <b-button variant="link" v-on:click.prevent="storeControls(store, 'prev', filter)">&#60;
                </b-button>
                <b-button variant="link" v-on:click.prevent="storeControls(store, 'next', filter)">&#62;
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="content overflow-hidden">
            <carousel
              :autoplay="store.autoplay"
              :autoplayHoverPause="true"
              :perPage="store.perPage || 2"
              :perPageCustom="store.perPageCustom || []"
              :scrollPerPage="false"
              :value="store.selected"
              :loop="true"
              :autoplayTimeout="store.autoplayTimeout || 5000"
              :paginationEnabled="false"
              @pageChange="(val) => store.currentSlide = val"
            >
              <slide v-for="(item, index) in store.content[filterSelected]" :key="index" class="slide">
                <b-card
                  :title="item.title"
                  :img-src="item.img"
                  :img-alt="item.title"
                  img-top
                  class="no-border"
                >
                  <b-card-text>
                    {{ item.price }}
                  </b-card-text>
                </b-card>
              </slide>
            </carousel>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel';

  export default {
    name: 'store-block',
    components: {
      Carousel,
      Slide
    },
    data() {
      return {
        timer: null
      };
    },
    props: {
      id: String,
      fluid: {
        type: Boolean,
        default: true
      },
      controls: {
        type: Boolean,
        default: true
      },
      title: String,
      store: Object,
      filter: [Object, null]
    },
    computed: {
      filterSelected: {
        get() {
          return this.filter.selected;
        },
        set(val) {
          this.filter.selected = val;
          this.store.selected = 0;
        }
      }
    },
    mounted() {
      this.storeSort(this.store);
    },
    methods: {
      storeControls(store, action, filter = null) {
        /**
         * Clear previews timeout
         */
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        /**
         * Disable and enable autoplay for carousel with this store
         * Emulate pause between slides
         * @type {boolean}
         */
        store.autoplay = false;
        this.timer = setTimeout(
          () => {
            store.autoplay = true;
          },
          store.autoplayTimeout
        );

        let current = store.currentSlide;
        let perPage = store.perPage;

        switch (action) {
          case 'prev':
            if (current - 1 < 0) {
              let selectStore = store.content[filter.selected].length - perPage;
              store.selected = selectStore > 0 ? selectStore : 0;
            } else {
              store.selected = current - 1;
            }
            break;
          case 'next':
            if (filter && filter.selected && store.content[filter.selected]) {
              store.selected = (current + (perPage + 1) > store.content[filter.selected].length) ? 0 : current + 1;
            } else {
              store.selected = current + 1;
            }
            break;
        }
      },
      storeSort(store, byField = 'rating', order = 'DESC') {
        let orderVector = 0;

        switch (order) {
          case 'ASC':
            orderVector = 1;
            break;
          case 'DESC':
          default:
            orderVector = -1;
        }

        if (store && store.content) {
          for (let key in store.content) {
            if (store.content.hasOwnProperty(key)) {
              store.content[key].sort((a, b) => {
                return (a[byField] - b[byField]) * (orderVector);
              });
            }
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
