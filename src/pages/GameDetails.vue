<template>
  <div :class="`${loadingClass} game-details`">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="game" class="content">
      <b-card no-body class="no-border">
        <b-row no-gutters>
          <b-col cols="5">
            <b-card-img left :src="game.img" :alt="game.title" class="rounded-lg" style="width: 100%;"></b-card-img>
          </b-col>
          <b-col cols="7">
            <b-card-body>
              <b-row>
                <b-col cols="7">
                  <b-card-title title-tag="h2" class="game-title font-weight-normal">{{ game.title }}</b-card-title>
                  <b-card-sub-title sub-title-tag="h6" sub-title-text-variant="white">{{ game.category }}
                  </b-card-sub-title>
                </b-col>
                <b-col cols="5">

                  <b-button variant="primary" size="lg" @click="gameBuy()" class="btn-buy"
                            v-if="currentRouteIs('game-details')">{{ game.price }}
                  </b-button>
                  <b-button v-else-if="currentRouteIs('my-game-details')" class="float-right btn-settings"
                            variant="link">
                    <img src="../assets/icons/settings.svg" alt="Settings">
                  </b-button>

                </b-col>
              </b-row>
              <b-row ref="hLine">
                <b-col>
                  <b-col cols="12" class="h-line"></b-col>
                </b-col>
              </b-row>


              <template v-if="currentRouteIs('game-details')">
                <b-row class="rating">
                  <b-col class="pr-0 m-auto d-inline-flex align-middle">
                    <span class="mr-3">{{ game.vote.toFixed(1) }}</span>
                    <vote-bar :vote="game.vote.toFixed(1)" style="font-size: 0.8em;"></vote-bar>
                  </b-col>
                </b-row>
                <b-row class="mt-3" size="sm">
                  <b-col>
                    <b-button variant="outline-secondary" class="btn-voted">Voted</b-button>
                  </b-col>
                </b-row>
              </template>
              <template v-else-if="currentRouteIs('my-game-details')">
                <b-row>
                  <b-col class="game-buttons">
                    <b-button variant="primary" class="border-0">Play</b-button>
                    <b-button variant="light" class="text-primary border-0 btn-delete">Uninstall</b-button>
                  </b-col>
                </b-row>
              </template>


            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
      <b-row class="mb-4 mt-4">
        <b-col>
          <carousel v-bind="carouselOptions" v-if="game.slides">
            <slide v-for="(image, index) in game.slides" :key="'slide-' + index" class="pr-1 pl-1">
              <b-card :img-src="image" class="no-border" no-body></b-card>
            </slide>
          </carousel>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col cols="9" v-html="description(game.description)">
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import {Carousel, Slide} from 'vue-carousel';
  import VoteBar from '../components/Progress/VoteBar';

  let carouselOptions = {
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
    data() {
      return {
        loading: false,
        game: null,
        error: null,
        carouselOptions: null
      }
    },
    created() {
      this.fetchData();
      this.carouselOptions = carouselOptions;
    },
    watch: {
      '$route': 'fetchData',
    },
    computed: {
      loadingClass() {
        if (this.loading) {
          return 'loading';
        } else {
          return '';
        }
      }
    },
    methods: {
      currentRouteIs(route) {
        return route === this.$router.currentRoute.name;
      },
      description(text) {
        if (text) {
          return text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, '<br>');
        } else {
          return '';
        }
      },
      gameBuy() {
        //confirm(`Confirm buy game with id ${this.game.id} for ${this.game.price}?`);
        this.$router.replace({query: Object.assign({}, this.$route.query, {auth: 'select'})});
      },
      fetchData() {
        this.error = null;
        this.game = null;
        this.loading = true;

        let gameId = this.$route.params.id;

        setTimeout(() => {
          this.loading = false;

          let game = this.$store.getters.getGameById(gameId);

          if (game) {
            this.game = game;
          } else {
            this.error = `Game with id ${gameId} not found`;
          }
        }, 500);
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .VueCarousel-pagination {
    text-align: left;

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


</style>
