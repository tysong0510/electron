<template>
  <div :class="`${loadingClass} game-details`">
    <div v-if="error.game" class="error">{{ "Not Found" || error.game }} {{ /* TODO print user friendly error message */ }}</div>

    <div v-if="!pending.game && game" class="content">
      <b-card no-body class="no-border mb-4 pb-4">
        <b-row no-gutters>
          <b-col cols="5">
            {{ /* TODO add placeholder image to src/assets */ }}
            <b-card-img
              left
              :src="(game.images && game.images.main && getImagePath(game)) || 'https://via.placeholder.com/320'"
              :alt="game.title"
              class="rounded-lg"
              style="width: 100%;"
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
                    <div v-if="game.publisher">Publisher: {{ game.publisher }}</div>
                    <div v-if="game.developer">Developer: {{ game.developer }}</div>
                  </b-card-text>
                </b-col>
                <b-col cols="5" class="text-center">
                  <div v-if="currentRouteIs('game-details')">
                    <div v-if="showBuyBtn">
                      <b-button variant="primary" size="lg" class="btn-buy" @click="gameBuy()">
                        {{ game.price | currency(game.currency) }}
                      </b-button>
                    </div>
                    <div v-if="!showBuyBtn">
                      <b-button v-if="showPauseBtn" variant="primary" size="lg" class="btn-buy" @click="pauseDownloading()">
                        Pause
                      </b-button>
                      <b-button v-if="showResumeBtn" variant="primary" size="lg" class="btn-buy" @click="resumeDownloading()">
                        Resume
                      </b-button>
                      <b-button
                        v-if="showPlayBtn"
                        variant="primary"
                        size="lg"
                        class="btn-buy"
                        :disabled="!isGameInstalled"
                        @click="playGame()"
                      >
                        Play
                      </b-button>
                      <transition>
                        <div :class="{ 'b-torrent-info': true, 'b-torrent-info__no-peers': numberOfPeers === 0 }">
                          <loading-progress
                            v-if="showDownloadProgress"
                            :progress="progress"
                            :indeterminate="isProgressIndeterminate"
                            shape="line"
                            size="160"
                            width="160"
                            height="6"
                          />
                          <div v-if="showDownloadProgress" class="torrent-info">Peers: {{ numberOfPeers }}</div>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <b-button v-else-if="currentRouteIs('my-game-details')" class="float-right btn-settings" variant="link">
                    <img src="../assets/icons/settings.svg" alt="Settings" />
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
                    <vote-bar :vote="game.vote || game.rating" style="font-size: 0.8em;" />
                  </b-col>
                </b-row>
                <b-row class="mt-2" size="sm">
                  <b-col>
                    <b-button variant="outline-secondary" class="btn-voted">
                      Voted
                    </b-button>
                    <b-button
                      v-if="$store.getters['IS_LOGGED_IN']"
                      variant="outline-secondary"
                      class="btn-voted ml-2"
                      @click="assignTorrent"
                    >
                      Assign torrent
                    </b-button>
                  </b-col>
                </b-row>
              </template>

              <template v-else-if="currentRouteIs('my-game-details')">
                <b-row>
                  <b-col class="game-buttons">
                    <b-button variant="primary" class="border-0" :disabled="!isGameInstalled" @click="playGame()">
                      Play
                    </b-button>
                    <b-button
                      variant="light"
                      class="text-primary border-0 btn-delete"
                      :disabled="!isGameInstalled"
                      @click="uninstallGame()"
                    >
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
            <slide v-for="(image, index) in getImagePath(game, 'slides')" :key="'slide-' + index" class="pr-1 pl-1 carousel-slide">
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
import { mapGetters, mapActions, mapState } from "vuex";
import { Carousel, Slide } from "vue-carousel";
import currency from "../mixins/currency";

import VoteBar from "../components/Progress/VoteBar.vue";
import { START_DOWNLOAD_GAME, PAUSE_DOWNLOAD_GAME, START_GAME, START_SEEDING } from "../store/actions-types";
import { IS_GAME_INSTALLED } from "../store/modules/path";
import { baseURL } from "../apiConfig";
import user from "../mixins/user";
import { IS_LOGGED_IN } from "../store/modules/auth";

const carouselOptions = {
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  loop: true,
  paginationEnabled: true,
  perPage: 2,
  scrollPerPage: false
};

export default {
  name: "GameDetails",

  components: {
    VoteBar,
    Carousel,
    Slide
  },

  mixins: [currency, user],

  data() {
    return {
      carouselOptions: null
    };
  },

  computed: {
    ...mapState({
      game: state => state.game,
      pending: state => state.pending,
      error: state => state.error
    }),
    loadingClass() {
      return this.pending.game ? "loading" : "";
    },
    ...mapGetters(["getGameById"]),
    progress() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      if (!torrent) {
        return 0;
      }
      if (torrent.downloaded) {
        return 1;
      }
      return torrent.progress ? torrent.progress.progress : 0;
    },
    numberOfPeers() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      if (!torrent || !torrent.progress) {
        return "n/a";
      }
      return torrent.progress.numPeers;
    },
    progressDisplay() {
      return `${Math.round(this.progress * 100)}%`;
    },
    showBuyBtn() {
      if (!this.$store.getters[IS_LOGGED_IN]) {
        return true;
      }
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return !torrent;
    },
    showPauseBtn() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return torrent && !torrent.downloaded && ["loading-metadata", "downloading"].includes(torrent.state);
    },
    showResumeBtn() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return torrent && !torrent.downloaded && ["paused", "error"].includes(torrent.state);
    },
    showPlayBtn() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return torrent && torrent.downloaded;
    },
    showDownloadProgress() {
      return this.$store.getters.findTorrentByGameId(this.game.id);
    },
    isProgressIndeterminate() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return torrent && torrent.state === "loading-metadata";
    },
    isGameInstalled() {
      return this.game && this.game.id && this.$store.getters[IS_GAME_INSTALLED](this.game.id);
    }
  },

  watch: {
    $route: "fetchData"
  },

  created() {
    this.fetchData();
    this.carouselOptions = carouselOptions;
  },

  updated() {
    this.isGameInstalled;
  },

  methods: {
    ...mapActions(["getGame"]),
    currentRouteIs(route) {
      return route === this.$router.currentRoute.name;
    },
    description(text) {
      if (text) {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\n/g, "<br>");
      }
      return "";
    },
    startDownloading() {
      this[START_DOWNLOAD_GAME]({
        gameId: this.game.id
      });
    },
    pauseDownloading() {
      this[PAUSE_DOWNLOAD_GAME]({
        gameId: this.game.id
      });
    },
    resumeDownloading() {
      this[START_DOWNLOAD_GAME]({
        gameId: this.game.id
      });
    },
    gameBuy() {
      // confirm(`Confirm buy game with id ${this.game.id} for ${this.game.price}?`);
      if (!this.$store.getters[IS_LOGGED_IN]) {
        this.$root.$emit("unauthorized", { noRedirect: true });
        // ipcRenderer.once(AUTHORIZED, this.gameBuy);
        this.$root.$once("authorized", this.gameBuy);
      } else if (this.game.magnetURI) {
        if (this.$store.getters.findTorrentByGameId(this.game.id)) {
          return;
        }

        this.startDownloading();
      } else {
        confirm("There is no seeds available for this game");
      }
    },
    assignTorrent() {
      this.$store.dispatch(START_SEEDING, { gameId: this.game.id });
    },
    playGame() {
      this[START_GAME]({
        gameId: this.game.id
      });
    },
    uninstallGame() {
      confirm("Please confirm to remove the game");
    },
    fetchData() {
      const gameId = this.$route.params.id || 0;
      this.getGame({ params: { id: gameId } });
    },
    getImagePath(game, type = "main") {
      if (game.images) {
        switch (type) {
          case "main":
            return game.images.main ? `${baseURL}/apps/${game.id}/${game.images.main}` : null;
          case "slides":
            if (game.images.slides || game.images.images) {
              const slides = [];

              for (const slide of game.images.slides || game.images.images) {
                slides.push(`${baseURL}/apps/${game.id}/${slide}`);
              }

              return slides;
            }
            return null;
        }
      } else {
        return null;
      }
    },
    ...mapActions([START_DOWNLOAD_GAME, PAUSE_DOWNLOAD_GAME, START_GAME])
  }
};
</script>

<style scoped lang="scss">
@import "~vue-progress-path/dist/vue-progress-path.css";

/deep/ .VueCarousel-pagination {
  text-align: left !important;
  float: left !important;

  .VueCarousel-dot-container {
    margin-top: 10px !important;

    .VueCarousel-dot {
      background-color: #696e80 !important;
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

.torrent-info {
  transition: opacity 0.5s;
  /* opacity: 0; */
  text-align: left;
  font-size: 75%;
}

/deep/ .b-torrent-info {
  &__no-peers {
    .vue-progress-path .progress {
      stroke: #eed202;
    }
    .vue-progress-path .background {
      stroke: red;
    }
  }

  /* &:hover {
      .torrent-info {
        opacity: 1;
      }
    } */
}
</style>
