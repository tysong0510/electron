<template>
  <!--<div>-->
  <!--<game-carousel-->
  <!--id="store-top"-->
  <!--title="Top"-->
  <!--:filter="filterStoreTop"-->
  <!--:store="storeTop"-->
  <!--:carousel-options="topCarouselOptions"-->
  <!--:controls-enabled="false"-->
  <!--view-all="store-top"-->
  <!--key="store-top"-->
  <!--&gt;-->
  <!--</game-carousel>-->
  <!--<game-carousel-->
  <!--id="store-featured"-->
  <!--title="Featured"-->
  <!--title-tag="h4"-->
  <!--:filter="filterStoreFeatured"-->
  <!--:store="storeFeatured"-->
  <!--:carousel-options="featuredCarouselOptions"-->
  <!--:controls-enabled="false"-->
  <!--view-all="store-featured"-->
  <!--key="store-featured"-->
  <!--&gt;-->
  <!--</game-carousel>-->
  <!--</div>-->
  <div class="text-white">
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <h2>{{ storeTitle }}</h2>
          </b-col>
          <b-col cols="4" v-if="filter">
            <b-select :options="filter.options" class="filter-period text-white" v-model="filterSelected">
            </b-select>
          </b-col>
          <b-col v-if="filter"></b-col>
        </b-row>
      </b-col>
      <b-col v-if="filter"></b-col>
    </b-row>
    <b-row class="border-bottom">
      <b-col v-for="(game, index) in content.slice(0, 3)" :key="index"
             class="p-2 rounded-lg game mb-4 mt-2" tag="a"
             :href="$router.resolve({name: 'game-details', params: {id: game.id}}).href">
        <b-card no-body class="border-0">
          <b-row>
            <b-col cols="12" class="col-img">
              <b-row class="h-100">
                <b-col class="m-auto">
                  <b-card-img :src="game.img" class="rounded-lg"></b-card-img>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="12">
              <b-card-body class="p-0 pt-2">
                <b-card-title title-tag="h5" class="font-weight-normal">{{ game.title }}</b-card-title>
                <b-card-sub-title title-tag="h6" class="font-weight-normal">
                  <b-row>
                    <b-col class="text-white" cols="5">
                      {{ game.price }}
                    </b-col>
                    <b-col class="downloaded" :title="'Downloaded ' + (game.downloaded || 0) + ' times'">
                      <img src="../assets/icons/downloaded.svg" alt="Downloaded">
                      {{ game.downloaded || 0 }}
                    </b-col>
                  </b-row>
                </b-card-sub-title>
                <b-card-text class="font-weight-normal mt-3">{{textCutter(game.description)}}
                  <b-link class="text-primary" v-if="textCutter(game.description).length > 140"
                          :href="$router.resolve({name: 'game-details', params: {id: game.id}}).href">More
                  </b-link>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="border-bottom limited-height-row mt-3 pb-3" v-for="(game, index) in content.slice(3)" :key="index">
      <b-col :key="index"
             class="p-2 rounded-lg game mt-1 mb-1" tag="a"
             :href="$router.resolve({name: 'game-details', params: {id: game.id}}).href">
        <b-card no-body class="border-0">
          <b-row>
            <b-col cols="2" class="m-auto text-center">
              <b-card-img :src="game.img" class="rounded-lg"></b-card-img>
            </b-col>
            <b-col>
              <b-card-body class="p-0">
                <b-card-title title-tag="h5" class="font-weight-normal mb-2">{{ game.title }}</b-card-title>
                <b-row>
                  <b-col cols="4">
                    <b-card-sub-title sub-title-tag="div" class="font-weight-normal mt-0" style="font-size: 14px;">
                      <b-row>
                        <b-col class="text-white">
                          {{ game.price }}
                        </b-col>
                        <b-col class="downloaded" :title="'Downloaded ' + (game.downloaded || 0) + ' times'">
                          <img src="../assets/icons/downloaded.svg" alt="Downloaded">
                          {{ game.downloaded || 0 }}
                        </b-col>
                      </b-row>
                    </b-card-sub-title>
                  </b-col>
                  <b-col>
                    <b-card-text class="font-weight-normal p-0 mt-0">{{textCutter(game.description)}}
                      <b-link class="text-primary" v-if="textCutter(game.description).length > 140"
                              :href="$router.resolve({name: 'game-details', params: {id: game.id}}).href">More
                      </b-link>
                    </b-card-text>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  // import GameCarousel from '../components/Carousel/GameCarousel';

  let colCounter = 0;

  export default {
    // components: {
    //   GameCarousel
    // },
    data() {
      return {
        name: 'Store',
        filterSelected: 'day',
        storeTitle: '',
        store: null,
        filter: null,
      };
    },
    computed: {
      currentStore() {
        return this.$router.currentRoute.name;
      },
      content: {
        get() {
          if (!this.store) {
            this.getData(this.currentStore);
          }

          if (this.store && this.store.hasOwnProperty('content')) {
            if (this.filter) {
              return this.store.content[this.filterSelected] || [];
            } else {
              if (Array.isArray(this.store.content)) {
                return this.store.content;
              } else {
                return this.store.content[Object.keys(this.store.content)
                  .pop()];
              }
            }
          } else {
            return [];
          }
        }
      }
    },
    methods: {
      getCols(index) {
        if (index === 0) {
          colCounter = 0;
        }

        colCounter += 1;

        if (colCounter < 4) {
          return '4';
        } else {
          return '2_5';
        }
      },
      textCutter(text = null) {
        let cuttedText = '';

        if (text && text.length > 140) {
          cuttedText = text
            .replace(/(([\S\s]{140})[\S\s]*)/gm, '$2')
            .replace(/[.,\s]*?$/, '...');
        } else {
          cuttedText = text ? text : '';
        }

        return cuttedText;
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
      },
      getData(storeName) {
        let filter = this.$store.getters.getFilterByName(storeName);
        if (filter) {
          this.filter = filter;
          this.filterSelected = this.filter.default;
        }

        let store = this.$store.getters.getRatingStoreByName(storeName) || {};

        this.storeTitle = store.title;

        if (store.sort) {
          this.storeSort(store, store.byField, store.order);
        }

        this.store = store;
      }
    },
    mounted() {

    },
    created() {
      this.getData(this.currentStore);
    },
    beforeDestroy() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../assets/scss/partials/store";

  .game {
    transition: ease-in-out 0.25s;

    &:link {
      text-decoration: none;
    }

    .card-text {
      font-size: 12px;
    }

    .downloaded {
      vertical-align: middle;

      img {
        height: 1em;
      }
    }

    .col-img {
      height: 200px;
      max-height: 200px;

      img {
        max-height: 200px;
      }
    }

    &:hover {
      background-color: $block-hover-background-color;
    }
  }

  .limited-height-row {
    max-height: 150px;

    .game {
      img {
        max-height: 75px;
        max-width: 120px;
      }
    }
  }

  .col-2_5 {
    -webkit-box-flex: 0;
    flex: 0 0 20%;
    max-width: 20%;
  }
</style>
