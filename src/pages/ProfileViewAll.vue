<template>
  <div class="text-white">
    <b-row class="mt-1 mb-4 pb-2">
      <b-col>
        <router-link
          :to="{name: 'profile'}"
          class="text-muted"
        >
          <div
            class="d-inline-block"
            style="border-left: 1px solid; border-bottom: 1px solid; border-radius: 1px; height: .6em; width: .6em; transform: matrix(1, 1, -1, 1, 0, 0);"
          />
          Back to profile
        </router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <h2>{{ storeTitle }}</h2>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="(game, index) in content.slice(0, 3)"
        :key="index"
        :href="$router.resolve({name: 'my-game-details', params: {id: game.id}}).href"
        class="p-2 rounded-lg game mb-4 mt-2"
        tag="a"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-row>
            <b-col
              class="col-img"
              cols="12"
            >
              <b-row class="h-100">
                <b-col class="m-auto">
                  <b-card-img
                    :src="getImagePath(game)"
                    class="rounded-lg"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="12">
              <b-card-body class="p-0 pt-2">
                <b-card-title
                  class="font-weight-normal"
                  title-tag="h5"
                >
                  {{ game.title }}
                </b-card-title>
                <template v-if="currentStore === 'my-recommendation'">
                  <b-card-sub-title
                    class="font-weight-normal mt-2"
                    sub-title-tag="h6"
                  >
                    <b-row>
                      <b-col class="text-white">
                        {{ game.price | currency(game.currency) }}
                      </b-col>
                    </b-row>
                  </b-card-sub-title>
                </template>
                <template v-else-if="currentStore === 'recently-played'">
                  <b-card-sub-title
                    class="font-weight-normal mt-2"
                    sub-title-tag="h6"
                  >
                    <b-row>
                      <b-col class="text-white">
                        {{ game.lastPlayed | distanceInWordsToNow({ addSuffix: true }) }}
                      </b-col>
                    </b-row>
                  </b-card-sub-title>
                </template>
                <template v-else>
                  <b-card-text class="font-weight-normal mt-3 text-muted">
                    <b-row>
                      <b-col>
                        {{ game.releaseDate | dateFormat }}
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        {{ game.size }} {{ game.sizeUnit }}
                      </b-col>
                    </b-row>
                  </b-card-text>
                </template>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row
      v-for="(game, index) in content.slice(3)"
      :key="index"
      class="border-bottom limited-height-row mt-3 pb-3"
    >
      <b-col
        :key="index"
        :href="$router.resolve({name: 'my-game-details', params: {id: game.id}}).href"
        class="p-2 rounded-lg game mt-1 mb-1"
        tag="a"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-row>
            <b-col
              class="m-auto text-center"
              cols="2"
            >
              <b-card-img
                :src="getImagePath(game)"
                class="rounded-lg"
              />
            </b-col>
            <b-col>
              <b-card-body class="p-0">
                <b-card-title
                  class="font-weight-normal"
                  title-tag="h5"
                >
                  {{ game.title }}
                </b-card-title>
                <b-card-text class="font-weight-normal mt-2 col-7 p-0 text-muted">
                  <template v-if="currentStore === 'my-recommendation'">
                    <b-row>
                      <b-col>
                        {{ game.price | currency(game.currency) }}
                      </b-col>
                    </b-row>
                  </template>
                  <template v-else-if="currentStore === 'recently-played'">
                    <b-row>
                      <b-col class="text-white">
                        {{ game.lastPlayed | distanceInWordsToNow({ addSuffix: true }) }}
                      </b-col>
                    </b-row>
                  </template>
                  <template v-else>
                    <b-row>
                      <b-col>
                        {{ game.releaseDate | dateFormat }}
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        {{ game.size }} {{ game.sizeUnit }}
                      </b-col>
                    </b-row>
                  </template>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import store from '../mixins/store';
import date from '../mixins/date';
import currency from '../mixins/currency';
import user from '../mixins/user';

export default {
  name: 'ProfileViewAll',
  filters: {},
  mixins: [store, date, currency, user],
  data() {
    return {
      storeTitle: '',
    };
  },
  computed: {
    content: {
      get() {
        if (!this.store) {
          this.getData(this.currentStore);
        }

        if (this.store && this.store.hasOwnProperty('content')) {
          if (this.filter) {
            return this.store.content[this.filterSelected] || [];
          }
          if (Array.isArray(this.store.content)) {
            return this.store.content;
          }
          return this.store.content[Object.keys(this.store.content)
            .pop()];
        }
        return [];
      },
    },
  },

  created() {
    this.getGames();
  },

  methods: {
    getData(storeName) {
      const store = this.$store.getters.getRatingStoreByName(storeName) || {};

      this.storeTitle = store.title || '';

      this.storeSort(store);

      this.store = store;
    },
  },
};
</script>

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
</style>
