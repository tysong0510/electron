<template>
  <div :id="id" class="game-carousel">
    <div :fluid="fluid">
      <b-row>
        <b-col>
          <b-row class="controls">
            <b-col :class="titleColClass">
              <b-row>
                <b-col>
                  <component :is="titleTag" :class="`title ${titleClass}`">
                    {{ title }}
                  </component>
                </b-col>
                <b-col class="filter" cols="5" v-if="filterEnabled">
                  <b-select :options="filter.options" class="filter-period" v-model="filterSelected">
                  </b-select>
                </b-col>
                <b-col v-if="filterEnabled"></b-col>
              </b-row>
            </b-col>
            <b-col v-if="filterEnabled"></b-col>

            <slot name="navigation">
              <b-col :class="`navigation ${controlsClass}`" v-if="controlsEnabled">
                <b-button-group class="d-flex m-auto">
                  <b-button v-on:click.prevent="navigation('prev')" variant="link">
                    <div class="btn-icon icon-prev"></div>
                  </b-button>
                  <b-button v-on:click.prevent="navigation('next')" variant="link">
                    <div class="btn-icon icon-next"></div>
                  </b-button>
                </b-button-group>
              </b-col>
            </slot>

            <b-col v-if="!controlsEnabled">
              <b-link class="float-right" @click="$router.push({name: viewAll})">View all</b-link>
            </b-col>
          </b-row>

          <b-row class="content overflow-hidden pt-3 pb-4">
            <carousel
              v-bind="normalizedCarouselOptions"
              :key="`carousel-${filterSelected}`"
              :navigateTo="carouselPosition"
              ref="carousel"
              @pageChange="(val) => carouselPositions[filterSelected] = val"
            >
              <slide :key="`slide-${index}`" class="slide" v-for="(item, index) in content"
                     @slideclick="$router.push({name: 'game-details', params: { id: item.id }})">
                <b-card
                  :img-alt="item.title"
                  :img-src="item.img"
                  :title="item.title"
                  :title-tag="store.imageTitleTag"
                  class="no-border"
                  img-top
                >
                  <b-card-text :class="store.imageTextClass" v-if="item.price || item.text">
                    {{ item.price || item.text }}
                  </b-card-text>
                </b-card>
              </slide>
            </carousel>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import {Carousel, Slide} from 'vue-carousel';

  let defaultCarouselOptions = () => ({
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    loop: true,
    paginationEnabled: false,
    perPage: 3,
    scrollPerPage: false,
  });

  export default {
    name: 'game-carousel',
    components: {
      Carousel,
      Slide
    },
    data() {
      return {
        carousel: null,
        currentFilter: null,
        carouselPositions: {},
      };
    },
    props: {
      id: {
        type: String,
        default: 'game-carousel-'
      },
      fluid: {
        type: Boolean,
        default: true
      },
      titleTag: {
        type: String,
        default: 'h3'
      },
      titleClass: {
        type: String,
        default: ''
      },
      titleColClass: {
        type: String,
        default: ''
      },
      controlsEnabled: {
        type: Boolean,
        default: true
      },
      controlsClass: {
        type: String,
        default: ''
      },
      title: String,
      viewAll: String,
      carouselOptions: {
        type: Object,
        default: defaultCarouselOptions
      },
      store: Object,
      filterEnabled: {
        type: Boolean,
        default: true
      },
      filter: {
        type: [Object, null],
        default: null
      }
    },
    computed: {
      normalizedCarouselOptions: {
        get() {
          return Object.assign(defaultCarouselOptions(), this.carouselOptions);
        }
      },
      filterSelected: {
        get() {
          return this.currentFilter;
        },
        set(val) {
          this.currentFilter = val;
        }
      },
      carouselPosition: {
        get() {
          let value = this.carouselPositions[this.filterSelected];
          return value ? value : 0;
        },
        set(val) {
          this.$set(this.carouselPositions, this.filterSelected, val);
        }
      },
      content: {
        get() {
          if (this.store.hasOwnProperty('content')) {
            if (this.filterEnabled) {
              return this.store.content[this.filterSelected];
            } else {
              if (Array.isArray(this.store.content)) {
                return this.store.content;
              } else {
                return this.store.content[Object.keys(this.store.content)
                  .pop()];
              }
            }
          } else {
            return null;
          }
        }
      }
    },
    mounted() {
      if (this.filterEnabled) {
        /**
         * Set default filter option
         */
        if (this.filter.default) {
          this.filterSelected = this.filter.default;
        } else {
          for (let filter of this.filter.options) {
            if (filter.value) {
              this.filterSelected = filter.value;
              break;
            }
          }
        }
      } else {
        this.filterSelected = null;
      }

      /**
       * Sort store by field with order
       */
      if (!this.store.hasOwnProperty('sort')) {
        this.storeSort(this.store);
      } else {
        if (this.store.sort) {
          let byField = this.store['sortByField'];
          let order = this.store['sortOrder'];

          this.storeSort(this.store, byField, order);
        }
      }

      /**
       * Generate random id if not set manually
       */
      if (this.id === 'game-carousel-') {
        this.id += this.randomString(8);
      }

      /**
       * Get carousel
       * @type {Carousel}
       */
      this.carousel = this.$refs.carousel;
    },
    updated() {
      /**
       * Update carousel
       * @type {Carousel}
       */
      this.carousel = this.$refs.carousel;
      window.dispatchEvent(new Event('resize'));
    },
    methods: {
      randomString: (len) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (let i = 0; i < len; i++) {
          result += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return result;
      },
      navigation(action) {
        switch (action) {
          case 'prev':
            this.carousel.handleNavigation('backward');
            this.carousel.restartAutoplay();
            break;
          case 'next':
            this.carousel.handleNavigation();
            this.carousel.restartAutoplay();
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

        if (store && store.content && !Array.isArray(store.content)) {
          for (let key in store.content) {
            if (store.content.hasOwnProperty(key)) {
              store.content[key].sort((a, b) => {
                return (a[byField] - b[byField]) * (orderVector);
              });
            }
          }
        } else {
          store.content.sort((a, b) => {
            return (a[byField] - b[byField]) * (orderVector);
          });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/partials/store";

  a:hover {
    text-decoration: none;
  }

  .game-carousel {
    .controls {
      color: white;

      .navigation {
        max-width: 140px;
      }

      .custom-select {
        color: white;
      }

      .title {
        //font-weight: bold;
      }
      h4.title {
        font-size: 1.5rem !important;
      }

      .btn {
        .btn-icon {
          background: none;
          border-radius: 1px;
          border: 2px none transparent;
          border-bottom: 2px solid $controls-icon-color;
          border-left: 2px solid $controls-icon-color;
          width: 0.55em;
          height: 0.55em;

          &.icon-prev {
            transform: matrix(1, -1, -1, -1, 0, 0);
          }

          &.icon-next {
            transform: matrix(-1, -1, 1, -1, 0, 0);
          }
        }

        &:hover {
          .btn-icon {
            border-color: $controls-icon-hover-color;
          }
        }
      }
    }

    .content {
      .slide {
        .no-border {
          border: none;
          margin: 10px;

          .card-body {
            padding-right: 0;
            padding-left: 0;
            color: white;
          }
        }
      }
    }
  }
</style>
