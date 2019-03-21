<template>
  <div :class="`${loadingClass} game-details`">
    <div v-if="error.game" class="error">
      {{ 'Not Found' || error.game }} {{ /* TODO print user friendly error message */ }}
    </div>

    <div v-if="!pending.game && game" class="content">
      <b-card no-body class="no-border">
        <b-row no-gutters>
          <b-col cols="5">
            {{ /* TODO add placeholder image to src/assets */ }}
            <b-card-img left
                        :src="(game.images && game.images.main && getImagePath(game)) || 'https://via.placeholder.com/320'"
                        :alt="game.title" class="rounded-lg" style="width: 100%;"
            />
          </b-col>
          <b-col cols="7">
            <b-card-body>
              <b-row>
                <b-col cols="7">
                  <b-card-title title-tag="h2" class="game-title font-weight-normal">
                    {{ game.title || game.name }}
                  </b-card-title>
                  <b-card-sub-title sub-title-tag="h6" sub-title-text-variant="white">
                    {{ game.category }}
                  </b-card-sub-title>
                  <b-card-text>
                    <div v-if="game.publisher">
                      Publisher: {{ game.publisher }}
                    </div>
                    <div v-if="game.developer">
                      Developer: {{ game.developer }}
                    </div>
                  </b-card-text>
                </b-col>
                <b-col cols="5" class="text-center">
                  <div v-if="currentRouteIs('game-details')">
                    <b-button
                      variant="primary"
                      size="lg"
                      class="btn-buy"
                      @click="gameBuy()"
                    >
                      <template v-if="showDownloadProgress">
                        {{ indeterminate ? 'Pause' : 'Resume' }}
                      </template>
                      <template v-else>
                        {{ game.price | currency(game.currency) }}
                      </template>
                    </b-button>
                    <transition @enter="startDownloading">
                      <loading-progress
                        v-if="showDownloadProgress"
                        :progress="progress"
                        :indeterminate="indeterminate"
                        shape="line"
                        size="160"
                        width="160"
                        height="6"
                      />
                    </transition>
                  </div>
                  <b-button
                    v-else-if="currentRouteIs('my-game-details')"
                    class="float-right btn-settings"
                    variant="link"
                  >
                    <img src="../assets/icons/settings.svg" alt="Settings">
                  </b-button>
                </b-col>
              </b-row>
              <b-row ref="hLine">
                <b-col>
                  <b-col cols="12" class="h-line" />
                </b-col>
              </b-row>

              <template v-if="currentRouteIs('game-details')">
                <b-row class="rating">
                  <b-col class="pr-0 m-auto d-inline-flex align-middle">
                    <span class="mr-3">
                      {{ (game.vote && game.vote.toFixed(1)) || (game.rating && game.rating.toFixed(1)) }}
                    </span>
                    <vote-bar
                      :vote="game.vote || game.rating"
                      style="font-size: 0.8em;"
                    />
                  </b-col>
                </b-row>
                <b-row class="mt-3" size="sm">
                  <b-col>
                    <b-button variant="outline-secondary" class="btn-voted">
                      Voted
                    </b-button>
                  </b-col>
                </b-row>
              </template>

              <template v-else-if="currentRouteIs('my-game-details')">
                <b-row>
                  <b-col class="game-buttons">
                    <b-button variant="primary" class="border-0">
                      Play
                    </b-button>
                    <b-button variant="light" class="text-primary border-0 btn-delete">
                      Uninstall
                    </b-button>
                  </b-col>
                </b-row>
              </template>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
      <b-row class="mb-4 mt-4">
        <b-col class="col-carousel">
          <carousel v-if="game.images && (game.images.slides || game.images.images)" v-bind="carouselOptions">
            <slide
              v-for="(image, index) in getImagePath(game, 'slides')"
              :key="'slide-' + index"
              class="pr-1 pl-1 carousel-slide"
            >
              <b-card :img-src="image" class="no-border" no-body />
            </slide>
          </carousel>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col cols="9" v-html="description(game.description)" />
      </b-row>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapState} from 'vuex';
  import {Carousel, Slide} from 'vue-carousel';

  import VoteBar from '../components/Progress/VoteBar.vue';
  import { START_DOWNLOAD_GAME } from '../store/actions-types';
  import {baseURL} from '../apiConfig';

  const carouselOptions = {
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    loop: true,
    paginationEnabled: true,
    perPage: 2,
    scrollPerPage: false,
  };

  export default {
    name: 'GameDetails',

    components: {
      VoteBar,
      Carousel,
      Slide
    },

    filters: {
      currency(value, currency = 'USD', locales = 'en-US') {
        return Intl.NumberFormat(locales, {style: 'currency', currency: currency}).format(value);
      }
    },

    data() {
      return {
        carouselOptions: null,
        showDownloadProgress: false,
        indeterminate: true,
        progress: 0
      };
    },

    computed: {
      ...mapState({
        game: state => state.game,
        pending: state => state.pending,
        error: state => state.error,
      }),
      loadingClass() {
        return this.pending.game ? 'loading' : '';
      },
      progressModel: {
        get() {
          return this.progress * 100
        },
        set(value) {
          this.progress = value / 100
        }
      },
      ...mapGetters([
        'getGameById'
      ]),
      progressDisplay() {
        return `${Math.round(this.progress * 100)}%`
      }
    },

    watch: {
      $route: 'fetchData',
    },

    created() {
      this.fetchData();
      this.carouselOptions = carouselOptions;
    },

    methods: {
      ...mapActions(['getGame']),
      currentRouteIs(route) {
        return route === this.$router.currentRoute.name;
      },
      description(text) {
        if (text) {
          return text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
        }
        return '';
      },
      startDownloading(el) {
        console.log(el);
        console.log('startDownloading from %' + this.progress);
        this.indeterminate = true;
      },
      pauseDownloading() {
        console.log('on pause');
        this.indeterminate = false;
      },
      gameBuy() {
        // confirm(`Confirm buy game with id ${this.game.id} for ${this.game.price}?`);
        // this.$router.replace({ query: Object.assign({}, this.$route.query, { auth: 'select' }) });
        if (!this.$auth.check()) {
          this.$root.$emit('unauthorized', {noRedirect: true});
          this.$root.$once('authorized', this.gameBuy);
        } else {
this[START_DOWNLOAD_GAME]({
gameId: this.game.id
});
          setTimeout(() => {
            if (this.showDownloadProgress) {
              this.indeterminate ? this.pauseDownloading() : this.startDownloading();
            } else {
              this.showDownloadProgress = true;
            }
            // wait login
            // confirm(`Confirm buy game with id ${this.game.id} for ${this.$options.filters.currency(this.game.price, this.game.currency)}?`);
          }, 100);
        }
      },
      fetchData() {
        const gameId = this.$route.params.id || 0;
        this.getGame({params: {id: gameId}});
        // this.game = this.$store.getters.getGameById(gameId);
      },
      getImagePath(game, type = 'main') {
        if (game.images) {
          switch (type) {
            case 'main':
              return game.images.main ? `${baseURL}/apps/${game.id}/${game.images.main}` : null;
            case 'slides':
              if (game.images.slides || game.images.images) {
                let slides = [];

                for (let slide of game.images.slides || game.images.images) {
                  slides.push(`${baseURL}/apps/${game.id}/${slide}`);
                }

                return slides;
              } else {
                return null;
              }
          }
        } else {
          return null;
        }
      },
...mapActions([START_DOWNLOAD_GAME])
    }
  };
</script>

<style scoped lang="scss">

  @import '~vue-progress-path/dist/vue-progress-path.css';

  /deep/ .VueCarousel-pagination {
    text-align: left;
    float: left;

    .VueCarousel-dot-container {
      margin-top: 10px !important;

      .VueCarousel-dot {
        background-color: #696E80 !important;
        height: 12px !important;
        width: 12px !important;
        padding: 0 !important;
        margin: 10px;

        &:focus {
          outline: unset;
        }

        &.VueCarousel-dot--active {
          background-color: white !important;
          box-shadow: 0 0 10px white;
        }
      }
    }
  }

  .col-carousel {
    margin-left: -4px;
    margin-right: -4px;
  }

  .game-details {
    color: white;

    .card-body {
      padding-top: 0;
      padding-bottom: 0;
      color: white;
    }

    .game-buttons {
      .btn {
        border-radius: 30px;
        margin-left: 0.5em;
        margin-right: 0.5em;
        min-width: 140px;
      }

      .btn-delete {
        background-color: white;

        &:hover {
          background-color: lightgray;
        }
      }
    }

    .btn-settings {
      padding-left: 0;
      padding-right: 0;
      width: 1.5em;

      &:hover img {
        width: 1.4em;
        height: 1.4em;
      }
    }

    .no-border {
      border: none;
    }

    .btn-buy {
      font-weight: bold;
      border-radius: 30px;
      width: 100%;
      max-width: 200px;
      font-size: 1em;
    }

    .btn-voted {
      border-radius: 30px;
      min-width: 140px;
    }

    .h-line {
      border: 1px solid #303453;
      margin: 20px 0;
    }

    .rating {
      font-size: 22px;
      font-weight: bold;
    }
  }

  .loading {
    &:before {
      position: absolute;
      content: "Loading...";
    }
  }

  .carousel-slide {
    .card-img {
      max-height: 280px;
    }
  }
</style>
