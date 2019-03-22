<template>
  <div>
    <b-card
      no-body
      class="flex-row pb-3 mb-2"
    >
      <b-card-img
        :src="avatar"
        class="img-profile pulse"
      />
      <b-card-body class="pr-0">
        <b-row no-gutters>
          <b-col class="col-auto mr-auto">
            <h2
              class="card-title display-2 text-white"
              style="font-size: 2.25rem;"
            >
              {{ name }}
            </h2>
          </b-col>
          <b-col class="col-auto">
            <!--<b-button id="playButton" v-on:click="play(game.gameId)" variant="outline">-->
            <img
              src="../assets/icons/settings.svg"
              alt="Settings"
            >
            <!--</b-button>-->
          </b-col>
        </b-row>

        <p class="card-subtitle text-white pb-4 border-bottom">
          {{ user.category }}
        </p>
      </b-card-body>
    </b-card>

    <b-row class="pb-5 mb-5 border-bottom">
      <b-col class="col-8 mr-auto text-white">
        <p class="pb-5">
          {{ user.bio }}
        </p>
        <b-row class="pb-4 mb-3">
          <b-col class="col-8 d-inline mr-auto">
            <h4
              class="display-4 d-inline"
              style="font-size: 1.5rem;"
            >
              Profile statistic
            </h4>
            <div class="d-inline pl-5">
              <b-select
                v-model="filterStatistics.selected"
                class="filter-period w-auto text-white font-weight-light"
                :options="filterStatistics.options"
              />
            </div>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="col-4 d-inline mr-auto">
            <d3-pie
              :data="[{key: 'test', value: 20}, {key: 'test1', value: 50}, {key: 'test2', value: 30}]"
              style="width: auto; height: 184.02px;"
            />
          </b-col>
          <b-col class="col-8 d-inline text-white">
            <ul class="mt-5 pt-5">
              <li>Downloaded games</li>
              <li>Spent time</li>
              <li>Spent money</li>
            </ul>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-4 d-inline text-white">
        <h3 class="d-inline">
          Friends
        </h3>
        <span class="d-inline float-right">0</span>
      </b-col>
    </b-row>

    <!--<div class="pb-5 mb-4 border-bottom">-->
    <!--<game-carousel-->
    <!--id="top-games"-->
    <!--title="Your top games"-->
    <!--title-tag="h4"-->
    <!--title-class="display-4"-->
    <!--:store="topGamesStore"-->
    <!--:filter-enabled="false"-->
    <!--:carousel-options="yourTopGamesCarouselOptions"-->
    <!--:controls-enabled="false"-->
    <!--view-all="my-top-games"-->
    <!--key="top-games"-->
    <!--v-once/>-->
    <!--</div>-->

    <horizontal-view
      v-if="!pending.games"
      v-once
      title="Your top games"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{name: 'my-top-games'}"
    >
      <b-col
        v-for="(game, index) in topGamesStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{'max-width': (100 / maxElements) + '%'}"
        tag="a"
        :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img
                  :src="getImagePath(game)"
                  :alt="game.title"
                  img-top
                  class="rounded-lg"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title
                  title-tag="h4"
                  class="mb-2"
                  style="font-size: .85em;"
                >
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price | currency(game.currency) }}
                </b-card-text>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </horizontal-view>

    <!--<div class="pb-5 mb-4 border-bottom">-->
    <!--<game-carousel-->
    <!--id="your-files"-->
    <!--title="Your files"-->
    <!--title-tag="h4"-->
    <!--title-class="display-4"-->
    <!--:store="yourFilesStore"-->
    <!--:filter-enabled="false"-->
    <!--:carousel-options="normalizeOptions(carouselOptions)"-->
    <!--:controls-enabled="false"-->
    <!--view-all="my-files"-->
    <!--key="your-files"-->
    <!--v-once/>-->
    <!--</div>-->

    <horizontal-view
      v-if="!pending.games"
      v-once
      title="Your files"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{name: 'my-files'}"
    >
      <b-col
        v-for="(game, index) in yourFilesStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{'max-width': (100 / maxElements) + '%'}"
        tag="a"
        :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img
                  :src="getImagePath(game)"
                  :alt="game.title"
                  img-top
                  class="rounded-lg"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title
                  title-tag="h4"
                  class="mb-2"
                  style="font-size: .85em;"
                >
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price | currency(game.currency) }}
                </b-card-text>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </horizontal-view>

    <!--<div class="pb-5 mb-4 border-bottom">-->
    <!--<game-carousel-->
    <!--id="your-recommendation"-->
    <!--title="Your recommendation"-->
    <!--title-tag="h4"-->
    <!--title-class="display-4"-->
    <!--:store="yourRecommendationStore"-->
    <!--:filter-enabled="false"-->
    <!--:carousel-options="normalizeOptions(carouselOptions)"-->
    <!--:controls-enabled="false"-->
    <!--view-all="my-recommendation"-->
    <!--key="your-recommendation"-->
    <!--v-once/>-->
    <!--</div>-->

    <horizontal-view
      v-if="!pending.games"
      v-once
      title="Your recommendation"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{name: 'my-recommendation'}"
    >
      <b-col
        v-for="(game, index) in yourRecommendationStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{'max-width': (100 / maxElements) + '%'}"
        tag="a"
        :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img
                  :src="getImagePath(game)"
                  :alt="game.title"
                  img-top
                  class="rounded-lg"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title
                  title-tag="h4"
                  class="mb-2"
                  style="font-size: .85em;"
                >
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price | currency(game.currency) }}
                </b-card-text>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </horizontal-view>

    <!--<game-carousel-->
    <!--id="recently-played"-->
    <!--title="Recently played"-->
    <!--title-tag="h4"-->
    <!--title-class="display-4"-->
    <!--:store="recentlyPlayedStore"-->
    <!--:filter-enabled="false"-->
    <!--:carousel-options="normalizeOptions(carouselOptions)"-->
    <!--:controls-enabled="false"-->
    <!--view-all="recently-played"-->
    <!--key="recently-played"-->
    <!--v-once/>-->

    <horizontal-view
      v-if="!pending.games"
      v-once
      title="Recently played"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{name: 'recently-played'}"
    >
      <b-col
        v-for="(game, index) in recentlyPlayedStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{'max-width': (100 / maxElements) + '%'}"
        tag="a"
        :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})"
      >
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img
                  :src="getImagePath(game)"
                  :alt="game.title"
                  img-top
                  class="rounded-lg"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title
                  title-tag="h4"
                  class="mb-2"
                  style="font-size: .85em;"
                >
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.lastPlayed | distanceInWordsToNow({ addSuffix: true }) }}
                </b-card-text>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </horizontal-view>
  </div>
</template>

<script>
import HorizontalView from '../components/View/HorizontalView.vue';
import store from '../mixins/store';
import date from '../mixins/date';
import currency from '../mixins/currency';

import { baseURL } from '../apiConfig';

export default {
  components: {
    HorizontalView,
  },
  mixins: [store, date, currency],
  data() {
    return {
      filterStatistics: {
        selected: 'day',
        options: [
          {
            value: 'day',
            text: 'Day',
          },
          {
            value: 'Week',
            text: 'Week',
          },
          {
            value: 'month',
            text: 'Month',
          },
          {
            value: 'year',
            text: 'Year',
          },
          {
            value: 'allTime',
            text: 'All time',
          },
        ],
      },
      maxElements: 5,
      yourTopGamesCarouselOptions: {
        perPage: 5,
        autoplay: false,
      },
      carouselOptions: {
        perPage: 5,
        autoplay: false,
      },
      topGamesStore: {
        sort: false,
        content: [],
      },
      yourFilesStore: {
        sort: false,
        content: [],
      },
      recentlyPlayedStore: {
        sort: false,
        content: [],
      },
      yourRecommendationStore: {
        sort: false,
        content: [],
      },
    };
  },
  computed: {
    user: {
      get() {
        return this.$auth.user();
      }
    },
    avatar: {
      get() {
        let userAvatar = this.user && this.user.images && this.user.images.main;

        if (userAvatar) {
          return baseURL + `/profile/${this.user.id}/${userAvatar}`;
        } else {
          /**
           * Return 1x1 transparent PNG pixel
           */
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }
      }
    },
    name: {
      get() {
        return `${this.user.firstName} ${this.user.lastName}`
      }
    }
  },
  created() {
    this.getGames();
  },
  methods: {
    getUrlByRoute(route) {
      return this.$router.resolve(route).href;
    },
    normalizeOptions(options) {
      return Object.assign({}, options);
    },
    getData() {
      Object.assign(this.topGamesStore, this.$store.getters.getRatingStoreByName('my-top-games'));
      this.storeSort(this.topGamesStore);
      Object.assign(this.yourRecommendationStore, this.$store.getters.getRatingStoreByName('my-recommendation'));
      this.storeSort(this.yourRecommendationStore);
      Object.assign(this.yourFilesStore, this.$store.getters.getRatingStoreByName('my-files'));
      this.storeSort(this.yourFilesStore);
      Object.assign(this.recentlyPlayedStore, this.$store.getters.getRatingStoreByName('recently-played'));
      this.storeSort(this.recentlyPlayedStore);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../assets/scss/partials/store";

  .card-body .card-text .text-recently-played {
    font-size: 0.3em !important;
  }

  .horizontal-view {
    .horizontal-view-items {
      .item {
        transition: ease-in-out 0.25s;

        &:hover {
          background-color: $block-hover-background-color;
        }
      }

      .game-image {
        max-height: 150px;
        min-height: 150px;

        img {
          max-height: 140px;
        }
      }
    }
  }

  .d-inline.float-right {
    font-size: 1.75rem;;
  }

  .img-profile,
  .card-img-left {
    background: url('../assets/icons/no-avatar.png');
    background-size: 100% 100%;
    height: 140px;
    width: 140px;
    border-radius: 50%;
    /*   margin: 10px auto; */
  }

  .pulse {
    box-shadow: 0 0 0 0 #696E80;
    animation: pulse 1.5s 1 cubic-bezier(0.66, 0, 0, 1);
  }

  @keyframes pulse {
    to {
      box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
    }
  }

</style>
