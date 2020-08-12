<template>
  <div :class="`${loadingClass} game-details`">
    <div v-if="error.game" class="error">{{ "Not Found" || error.game }} {{ /* TODO print user friendly error message */ }}</div>
    <!-- Can place router link right here-->
    <b-row class="mt-1 mb-4 pb-2">
      <b-col>
        <b-link @click="routerLink()">
          <div
            class="d-inline-block"
            style="border-left: 1px solid; border-bottom: 1px solid; border-radius: 1px; height: .6em; width: .6em; transform: matrix(1, 1, -1, 1, 0, 0);"
          />
          Back</b-link
        >
      </b-col>
    </b-row>
    <div v-if="!pending.game && game && !pending.gameStatus" class="content">
      <b-card no-body class="no-border mb-4 pb-4">
        <b-row no-gutters>
          <b-col cols="5">
            {{ /* TODO add placeholder image to src/assets */ }}
            <b-card-img
              left
              :src="getImagePath(game) || 'https://via.placeholder.com/320'"
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
                    <div v-if="showBuyBtn && !gameStatus">
                      <b-button
                        v-if="game.price != 500 && game.price != 250"
                        variant="primary"
                        size="lg"
                        class="btn-buy"
                        :disabled="isGameInCart"
                        @click="addProduct(game)"
                      >
                        <b-spinner v-if="pending.buyGame"></b-spinner>
                        <span v-else class="price">{{ game.price | currency(game.currency) }}</span>
                        <span class="addToCart">Add to Cart</span>
                      </b-button>

                      <b-button v-else variant="primary" size="lg" class="btn-buy">
                        <span>TBD</span>
                      </b-button>
                    </div>
                    <div v-else-if="gameStatus && !(showPauseBtn || showResumeBtn)">
                      <b-button
                        v-if="!isGameDownloaded"
                        :disabled="load"
                        variant="primary"
                        size="lg"
                        class="btn-buy"
                        @click="startDownloadingForSeeding()"
                      >
                        <span v-if="!load">Download</span>
                        <b-spinner v-if="load"></b-spinner>
                      </b-button>
                      <b-button v-else-if="isGameDownloaded" variant="primary" size="lg" class="btn-buy" @click="tempPlayGame()">
                        Play
                      </b-button>

                      <div v-if="load" class="p-3">
                        <b-progress :value="percentage" :max="maxPercentage" animated></b-progress>
                        {{ percentage }}/100
                      </div>
                    </div>
                  </div>
                  <div v-else-if="currentRouteIs('my-game-details')">
                    <b-row>
                      <b-col class="game-buttons p-2">
                        <b-button
                          v-if="!isGameDownloaded"
                          :disabled="load"
                          variant="primary"
                          size="lg"
                          class="btn-buy"
                          @click="startDownload()"
                        >
                          <span v-if="!load">Download</span>
                          <b-spinner v-if="load"></b-spinner>
                        </b-button>
                        <b-button v-else-if="isGameDownloaded && !load" variant="primary" size="lg" class="btn-buy" @click="tempPlayGame">
                          Play
                        </b-button>
                        <div v-if="load && !isGameDownloaded" class="p-3">
                          <b-progress :value="percentage" :max="maxPercentage" animated></b-progress>
                          {{ percentage }}/100
                        </div>
                      </b-col>

                      <b-col class="p-2">
                        <b-button
                          v-if="!isGameRecommended"
                          :disabled="hasItBeenRecommended"
                          variant="outline-secondary"
                          class="btn-voted ml-2"
                          @click="addToRecommendedGames(game)"
                        >
                          <span>Recommend</span>
                        </b-button>
                        <b-button
                          v-else-if="isGameRecommended"
                          variant="success"
                          class="btn-voted ml-2"
                          @click="removeFromRecommendedGames(game)"
                        >
                          <span class="show"> Recommended </span>
                          <span class="hoverShow">Un-Recommend</span>
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
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
              </template>

              <template v-else-if="currentRouteIs('my-game-details')">
                <div v-if="isGameDownloaded">
                  <b-row>
                    <b-col class="col-7 torrent-status">
                      <transition>
                        <div :class="{ 'b-torrent-info': true, 'b-torrent-info__no-peers': numberOfPeers === 0 }">
                          <loading-progress
                            v-if="showDownloadProgress"
                            :progress="progress"
                            shape="line"
                            size="160"
                            width="160"
                            height="6"
                          />
                          <br />
                          <span v-if="!seeding && showDownloadProgress">Downloading: {{ progressDisplay }}</span>
                          <span v-if="paused && seeding">
                            Seeding paused
                          </span>
                          <span v-if="!paused && seeding">
                            Seeding
                          </span>
                          <br />
                          <span v-if="showDownloadProgress" class="torrent-info">Peers: {{ numberOfPeers }}</span>
                        </div>
                      </transition>
                    </b-col>
                    <b-col class="torrent-buttons">
                      <b-button v-if="showPauseBtn" variant="primary" size="lg" class="btn-buy" @click="pauseDownloading()">
                        Pause Seeding
                      </b-button>
                      <b-button v-if="showResumeBtn" variant="primary" size="lg" class="btn-buy" @click="resumeDownloading()">
                        Resume Seeding
                      </b-button>
                      <!-- <b-button variant="primary" size="lg" class="btn-buy" @click="copyMagnetURI()">
                        Copy MagnetURI
                      </b-button> -->
                    </b-col>
                  </b-row>
                </div>
              </template>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>

      <b-row class="mt-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <b-col cols="9" v-html="description(game.description)" />
      </b-row>

      <b-row class="mb-4 mt-4">
        <b-col class="col-carousel">
          <carousel v-if="game.images && (game.images.slides || game.images.images)" v-bind="carouselOptions">
            <slide v-for="(image, index) in getImagePath(game, 'slides')" :key="'slide-' + index" class="pr-1 pl-1 carousel-slide">
              <b-card :img-src="image" class="no-border" no-body />
            </slide>
          </carousel>
        </b-col>
      </b-row>
    </div>
    <b-modal id="ratingModal" ref="ratingModal" class="ratingModal" centered hide-footer title="Select Your Rating">
      <b-row class="border-bottom border-top limited-height-row mt-3 pb-3 ">
        <b-col class="p-2 rounded-lg mt-1">
          <b-form-radio v-model="ratingValue" value="1">
            <b-icon-star></b-icon-star>
          </b-form-radio>
        </b-col>
        <b-col class="p-2 rounded-lg mt-1">
          <b-form-radio v-model="ratingValue" value="2">
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
          </b-form-radio>
        </b-col>
        <b-col class="p-2 rounded-lg mt-1">
          <b-form-radio v-model="ratingValue" value="3">
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
          </b-form-radio>
        </b-col>
        <b-col class="p-2 rounded-lg mt-1">
          <b-form-radio v-model="ratingValue" value="4">
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
          </b-form-radio>
        </b-col>
        <b-col class="p-2 rounded-lg mt-1">
          <b-form-radio v-model="ratingValue" value="5">
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
            <b-icon-star></b-icon-star>
          </b-form-radio>
        </b-col>
      </b-row>
      <b-row class="p-3">
        <b-col class="w-100 d-flex">
          <b-button
            size="lg"
            variant="primary"
            class="btn-auth"
            style="min-width: 180px; margin: 0 auto;"
            :disabled="ratingLoad"
            @click="rate()"
          >
            <span v-if="!ratingLoad" style="max-width: 1em; max-height: 1em;">Submit</span>
            <b-spinner v-else></b-spinner>
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      id="ratingSubmissionModal"
      ref="ratingSubmissionModal"
      class="ratingSubmissionModal"
      centered
      hide-footer
      title="Submission Successful"
    >
      <b-row class="border-bottom border-top limited-height-row mt-3 pb-3 ">
        <b-col class="p-2 rounded-lg mt-1">
          <h2>Your Rating has been successfully submitted!</h2>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { Carousel, Slide } from "vue-carousel";
import currency from "../mixins/currency";
import { USER } from "../store/modules/auth";

import VoteBar from "../components/Progress/VoteBar.vue";
import {
  START_DOWNLOAD_GAME,
  PAUSE_DOWNLOAD_GAME,
  START_GAME,
  START_SEEDING,
  UNINSTALL_GAME,
  INSTALL_GAME
  //ADD_TO_CART
} from "../store/actions-types";

import { CAN_GAME_INSTALL, IS_GAME_INSTALLED } from "../store/modules/path";
//import { baseURL } from "../apiConfig";
import user from "../mixins/user";
import { IS_LOGGED_IN } from "../store/modules/auth";
const { ipcRenderer } = require("electron");
import axios from "axios";
import Axios from "axios";
import request from "request";
import fs from "fs";
import child_process from "child_process";
import { remote } from "electron";
import path from "path";
const dialog = remote.dialog;
const win = remote.getCurrentWindow();

//import path from "path";
const USER_DATA_PATH = remote.app.getPath("userData");
const VOXPOP = "voxpop";
const APPS = "apps";
const TEMP = "temp";

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
      carouselOptions: null,
      uninstalling: false,
      installing: false,
      apiResponse: "",
      apiResponseError: "",
      pathRequest: "",
      loading: false,
      percentage: 0.0,
      maxPercentage: 100,
      load: false,
      recommended: false,
      unRecommended: true,
      ratingValue: null,
      ratingLoad: false
    };
  },

  computed: {
    ...mapState({
      game: state => state.game,
      gameStatus: state => state.gameStatus,
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
        return 0;
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
      return torrent && ["loading-metadata", "downloading", "seeding"].includes(torrent.state);
    },
    showResumeBtn() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);
      return torrent && ["paused", "error"].includes(torrent.state);
    },
    paused() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);

      return torrent && torrent.state === "paused";
    },
    seeding() {
      const torrent = this.$store.getters.findTorrentByGameId(this.game.id);

      return torrent && torrent.downloaded;
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
    },
    canGameInstall() {
      return this.game && this.game.id && this.$store.getters[CAN_GAME_INSTALL](this.game.id);
    },
    isGameInCart() {
      var isGameInCart = false;
      var shoppingCart = this.$store.state.cart;
      for (var i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].id == this.game.id) {
          isGameInCart = true;
        }
      }
      //return this.$store.state.cart.includes(this.game);
      return isGameInCart;
    },

    isGameRecommended() {
      var isGameRecommended = false;
      var recommendedGames = this.$store.state.recommendedGames;
      for (var i = 0; i < recommendedGames.length; i++) {
        if (recommendedGames[i].id == this.game.id) {
          isGameRecommended = true;
        }
      }
      //return this.$store.state.cart.includes(this.game);
      return isGameRecommended;
    },
    hasItBeenRecommended() {
      var recommendedGames = this.$store.state.recommendedGames;
      for (var i = 0; i < recommendedGames.length; i++) {
        if (recommendedGames[i].id == this.game.id) {
          return true;
        }
      }
      return false;
    },
    isGameDownloaded() {
      console.log("===========================================");
      if (this.$store.state.tempDownloadedGames[this.game.id]) {
        return true;
      }

      if (this.$store.getters.findTorrentByGameId(this.game.id)) {
        return true;
      }

      return false;
    },

    isGameServerDownloaded() {
      console.log("tempDownloadedGames: ", this.$store.state.tempDownloadedGames[this.game.id]);

      if (this.$store.state.tempDownloadedGames[this.game.id]) {
        return true;
      }

      return false;
    },

    didVote() {
      var votedGames = this.$store.state.votedGames;

      var voted = false;

      for (var i = 0; i < votedGames; i++) {
        if (votedGames[i].id == this.game.id) {
          voted = true;
        }
      }
      console.log("Was this game voted on: ", voted);
      return voted;
    }
  },

  watch: {
    $route: "fetchData"
  },

  created() {
    this.fetchData();
    this.carouselOptions = carouselOptions;
    this.$store.dispatch("retrievePath");
    this.$store.dispatch("retrieveDownloadedGame");
    this.$store.dispatch("retrieveRecommendedGames", this.$store.state.auth.user.username);
    this.$store.dispatch("getVotedGames", this.$store.state.auth.user.username);
  },
  updated() {
    this.isGameInstalled;
    this.isTempGameDownloaded;
  },

  methods: {
    ...mapActions(["getGame", "getGameStatus"]),
    currentRouteIs(route) {
      return route === this.$router.currentRoute.name;
    },
    isMagnetLinkValid(magnetLink) {
      if (magnetLink === null || magnetLink.search("magnet:?") === -1) {
        return false;
      }
      return true;
    },
    description(text) {
      if (text) {
        return (
          text
            // .replace(/&/g, "&amp;")
            // .replace(/</g, "&lt;")
            // .replace(/>/g, "&gt;")
            // .replace(/"/g, "&quot;")
            // .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>")
        );
      }
      return "";
    },
    startDownloadingForSeeding() {
      console.log("startDownloading from the torrent");
      this[START_DOWNLOAD_GAME]({
        gameId: this.game.id
      });
    },
    startDownloading() {
      console.log("startDownloading from the server", this.game);
      this.load = true;
      //create file path hidden inside voxpop directory
      var filePath = this.createDirectory();

      /**
       * this option is reserved to let user pick their own directory to save game
       *  */
      if (!filePath) {
        let options = {
          title: "Choose Directory to save " + this.game.title,
          buttonLabel: "Select Directory",
          properties: ["openDirectory"]
        };
        filePath = dialog.showOpenDialog(win, options);
        this.$store.dispatch("savePath", filePath);
      }

      if (this.game.downloadURL !== null && this.game.dataFile !== null) {
        console.log("startDownloading from the server with data file");
        if (filePath) {
          var recievedBytes = 0;
          var totalBytes = 0;

          var req = request({
            method: "GET",
            uri: this.game.downloadURL
          });

          var noSpaceTitle = this.game.title;
          noSpaceTitle = noSpaceTitle.replace(/ /g, "-");
          var out = fs.createWriteStream(filePath + "/" + noSpaceTitle + ".exe", { mode: 0o777 }); //should allow read,write,execute permissions
          req.pipe(out);

          req.on("response", function(data) {
            totalBytes = parseInt(data.headers["content-length"]);
          });

          req.on("data", chunk => {
            recievedBytes += chunk.length;
            this.percentage = parseInt((recievedBytes * 100) / totalBytes);
          });

          req.on("end", () => {
            let savedContent = {
              game: this.game,
              path: filePath
            };
            this.$store.dispatch("addDownloadedGame", savedContent);

            this.downloadDataFile(filePath);

            // TODO: Need to add logic to seed all files download from the server.
          });
        } else {
          this.load = false;
          console.log("user cancelled...");
        }
      }

      if (this.game.downloadURL !== null && this.game.dataFile === null) {
        if (filePath) {
          console.log("startDownloading from the server without data file");
          let recievedBytesM = 0;
          let totalBytesM = 0;

          let reqM = request({
            method: "GET",
            uri: this.game.downloadURL
          });

          let noSpaceTitleM = this.game.title;
          noSpaceTitleM = noSpaceTitleM.replace(/ /g, "-");
          let outM = fs.createWriteStream(filePath + "/" + noSpaceTitleM + ".exe", { mode: 0o777 }); //should allow read,write,execute permissions
          reqM.pipe(outM);

          reqM.on("response", function(data) {
            totalBytesM = parseInt(data.headers["content-length"]);
          });

          reqM.on("data", chunk => {
            recievedBytesM += chunk.length;
            this.percentage = parseInt((recievedBytesM * 100) / totalBytesM);
          });

          reqM.on("end", () => {
            let savedContent = {
              game: this.game,
              path: filePath
            };

            this.$store.dispatch("addDownloadedGame", savedContent);
            this.$store.dispatch("retrieveDownloadedGame");

            this.load = false;

            // console.log('==== Download FInished =====');
            // const seedFilePath = filePath + "/" + noSpaceTitleM + ".exe";

            // this.$store.dispatch(START_SEEDING, { gameId: this.game.id, filePaths: [seedFilePath] });

            // console.log("START_SEEDING = ", seedFilePath);
          });
        } else {
          this.load = false;
          console.log("user cancelled...");
        }
      }
    },

    downloadDataFile(filePath) {
      var recievedBytesD = 0;
      var totalBytesD = 0;

      var reqD = request({
        method: "GET",
        uri: this.game.dataFile
      });

      var noSpaceTitleD = this.game.title;
      noSpaceTitleD = noSpaceTitleD.replace(/ /g, "-");
      var outD = fs.createWriteStream(filePath + "/" + noSpaceTitleD + ".exe.data", { mode: 0o777 }); //should allow read,write,execute permissions
      reqD.pipe(outD);

      reqD.on("response", function(data) {
        totalBytesD = parseInt(data.headers["content-length"]);
      });

      reqD.on("data", chunk => {
        recievedBytesD += chunk.length;
        this.percentage = parseInt((recievedBytesD * 100) / totalBytesD);
      });

      reqD.on("end", () => {
        this.$store.dispatch("retrieveDownloadedGame");
        this.load = false;
      });
    },
    /** 
    * 
    * This function goes alongside letting the user pick a directory
    changeDirectory() {
      this.$store.dispatchPromise("removePath");
      var filePath = null;
      let options = {
        title: "Choose Directory to save " + this.game.title,
        buttonLabel: "Select Directory",
        properties: ["openDirectory"]
      };
      filePath = dialog.showOpenDialog(win, options);
      this.$store.dispatch("savePath", filePath);
    },
    */

    /**
     * This creates a directory using the path below, if it already exists it will just return it
     */
    createDirectory() {
      var concatTitle = this.game.title;
      concatTitle = concatTitle.replace(/ /g, "-");
      const absolutePath = path.join(USER_DATA_PATH, VOXPOP, this[USER].username, APPS, TEMP, concatTitle);
      if (!fs.existsSync(absolutePath)) {
        this.mkdirDeep(absolutePath);
      }
      return absolutePath;
    },

    /**
     * The function recursively creates directories in the specified path if they do not exist
     *
     * @param {string} dirPath - Path to directory
     * @param {object | number} options - The same as [here](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options)
     */
    mkdirDeep(dirPath, options = undefined) {
      if (!fs.existsSync(dirPath)) {
        this.mkdirDeep(path.join(dirPath, ".."), options);
        fs.mkdirSync(dirPath, options);
      }
    },

    addToRecommendedGames(game) {
      let recoParams = {
        username: this.$store.state.auth.user.username,
        game: game
      };
      //this.$store.dispatch("addToRecommendedGames", recoParams);// need to make this sidpatch promise...

      this.$store
        .dispatchPromise("addToRecommendedGames", recoParams)
        .then(() => {
          this.saveRecommendedGamesInAPI(this.$store.state.recommendedGames);
        })
        .catch(err => {
          console.log("There was an error saving recommended games: ", err);
        });
      //this.saveRecommendedGamesInAPI();
    },

    removeFromRecommendedGames(game) {
      this.recommendedLoading = true;
      let recoParams = {
        username: this.$store.state.auth.user.username,
        game: game
      };

      //this.$store.dispatch("removeFromRecommendedGames", recoParams);
      //this.saveRecommendedGamesInAPI();
      //this.recommendedLoading = false;

      this.$store
        .dispatchPromise("removeFromRecommendedGames", recoParams)
        .then(() => {
          this.saveRecommendedGamesInAPI(this.$store.state.recommendedGames);
        })
        .catch(err => {
          console.log("There was an error saving recommended games: ", err);
        });
    },

    async saveRecommendedGamesInAPI(data) {
      var gameArray = [];

      for (var i = 0; i < data.length; i++) {
        gameArray.push(data[i].id);
      }

      const formData = new FormData();
      formData.append("username", this.$store.state.auth.user.username);
      formData.append("recommendedGames", gameArray);

      try {
        await axios.post("/recommendedGames", formData);
      } catch (err) {
        const res = err && err.response;

        console.log("there was an error with this axios request: ", res);
      }
    },

    addProduct(game) {
      if (!this.$store.getters[IS_LOGGED_IN]) {
        this.$root.$emit("unauthorized", { noRedirect: true });
      } else {
        this.$store.dispatch("addToCart", game);
        console.log("Value of route params: ", this.$route.params);
        console.log("Is user id null: ", this.$route.params.user == null);
        if (this.$route.params.user != null) {
          let userParams = {
            userId: this.$route.params.user.id,
            gameId: this.game.id
          };

          let data = {
            user: this.$route.params.user,
            game: game
          };

          console.log("data to be added to recoUserAndGame: ", data);
          this.$store.dispatch("addRecoUserAndGame", data);
          console.log("list of recommended userId's after adding: ", this.$store.state.recommendedUserId);
          this.$store.dispatch("addUserRecommendedIdIndex", userParams);
        } else {
          let data = {
            user: null,
            game: game
          };
          this.$store.dispatch("addRecoUserAndGame", data);
          this.$store.dispatch("addUserRecommendedIdIndex", null);
        }
      }
      //console.log("from test function...");
      //this.addToCart(game);

      //localStorage.setItem("cart", this.$store.state.cart);
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
    copyMagnetURI() {
      var textArea = document.createElement("textarea");
      textArea.style.position = "fixed";
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = 0;
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.value = this.game.magnetURI;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
      } catch (err) {
        console.log("Oops, unable to copy");
      }
      document.body.removeChild(textArea);
    },
    formReset() {
      this.name = null;
      this.cardNum = null;
      this.expMonth = null;
      this.expYear = null;
      this.cvc = null;
      this.address = null;
      this.city = null;
      this.state = null;
    },
    async gameBuy() {
      if (this.$router.currentRoute.name !== "game-details") {
        return;
      }

      if (!this.$store.getters[IS_LOGGED_IN]) {
        this.$root.$emit("unauthorized", { noRedirect: true });
        // ipcRenderer.once(AUTHORIZED, this.gameBuy);
        // this.$root.$once("authorized", this.gameBuy);
      } else if (
        confirm(`Confirm purchasing game "${this.game.title}" for ${this.$options.filters.currency(this.game.price, this.game.currency)}?`)
      ) {
        try {
          ipcRenderer.send("open-new-window", this.game.id, this.game.price);
        } catch (err) {
          console.log(err);
        }
      }
    },
    startDownload() {
      // if (this.isMagnetLinkValid(this.game.magnetURI)) {
      //   if (this.$store.getters.findTorrentByGameId(this.game.id)) {
      //     return;
      //   }
      //   this.startDownloadingForSeeding();
      // } else if (this.game.magnetURI !== null) {
      //   this.startDownloading();
      // }
      if (this.game.magnetURI !== null) {
        this.startDownloading();
      }
    },
    assignTorrent() {
      this.$store.dispatch(START_SEEDING, { gameId: this.game.id });
    },
    isTempGameDownloaded() {
      return this.$store.state.tempDownloadedGames[this.game.id];
    },
    isRecommended() {
      return this.$store.state.recommendedGames[this.game.id];
    },
    async tempPlayGame() {
      var originalPath = this.$store.state.tempDownloadedGames[this.game.id];

      const execFile = fs
        .readdirSync(originalPath)
        .filter(absPath => path.extname(absPath).toLowerCase() === ".exe")
        .shift();
      if (!execFile) {
        console.log("file could not be found in path: ", originalPath);
        //alert("could not find file in path");
      } else {
        var pathToGame = path.join(originalPath, execFile);

        console.log("pathToGame using path.join windows: ", pathToGame);
        //console.log(await child_process.execFile(pathToGame));
        var username = this.$store.state.auth.user.username;
        var password = this.$store.state.auth.user.password;
        console.log("Username: ", username);
        console.log("Password: ", password);
        //return await child_process.execFile(pathToGame, [username, password]);
        return await child_process.execFile(pathToGame);
      }
    },

    playGame() {
      this.$store
        .dispatchPromise(START_GAME, {
          gameId: this.game.id
        })
        .then(res => {
          if (res && res.error) {
            confirm("An error occurred while starting the game");
          }
        })
        .catch(() => {
          confirm("An error occurred while starting the game");
        });
    },
    installGame() {
      this.installing = true;

      this.$store
        .dispatchPromise(INSTALL_GAME, { gameId: this.game.id })
        .then(res => {
          setTimeout(() => {
            this.installing = false;
            this.fetchData();
          }, 500);
          console.log(res);
        })
        .catch(err => {
          setTimeout(() => {
            this.installing = false;
            this.fetchData();
          }, 500);
          console.log(err);
        });
    },
    uninstallGame() {
      if (confirm("Please confirm to uninstall the game")) {
        this.uninstalling = true;
        this.$store
          .dispatchPromise(UNINSTALL_GAME, { gameId: this.game.id })
          .then(res => {
            setTimeout(() => {
              this.uninstalling = false;
              this.fetchData();
            }, 500);
            console.log(res);
          })
          .catch(err => {
            setTimeout(() => {
              this.uninstalling = false;
              this.fetchData();
            }, 500);
            console.log(err);
          });
      }
    },
    fetchData() {
      const gameId = this.$route.params.id || 0;
      this.getGameStatus({ params: { id: gameId } });
      this.getGame({ params: { id: gameId } });
    },
    getImagePath(game, type = "main") {
      if (game.images) {
        //Need to change method.........................
        switch (type) {
          case "main":
            return game.images.main; //this will return the main logo photo
          case "slides":
            if (game.images.slides || game.images.images) {
              //const slides = game.images.slides[0];

              const slides = [];

              for (var i = 0; i < game.images.slides.length; i++) {
                slides.push(game.images.slides[i]);
              }

              return slides;
            }

            return null;
        }
      } else {
        return null;
      }
    },
    ...mapActions([START_DOWNLOAD_GAME, PAUSE_DOWNLOAD_GAME, START_GAME]),

    routerLink() {
      if (this.$route.params.user != null) {
        this.$router.push({ name: "userDirectoryProfile", params: { user: this.$route.params.user } });
      } else {
        this.$router.go(-1);
      }
    },

    async rate() {
      console.log("The value for rate is: ", this.ratingValue);
      this.ratingLoad = true;

      const formData = new FormData();

      formData.append("rating", this.ratingValue);

      formData.append("gameTitle", this.game.title);

      // try {
      //   await axios.post("/games/rating",formData);
      // } catch(err) {
      //   console.log("There was an error submitting form data...");
      // }

      let params = {
        rating: this.ratingValue,
        gameTitle: this.game.title
      };

      Axios({ url: "/games/rating", params: params, method: "POST" })
        .then(async resp => {
          console.log("Successfully submitted rating, response is: ", resp);
          let voteParams = {
            game: this.game,
            username: this.$store.state.auth.user.username
          };
          this.$store.dispatch("setVotedGames", voteParams);
          this.ratingLoad = false;
        })
        .catch(err => {
          console.log("There was an error submitting rating: ", err);
          this.ratingLoad = false;
        });

      this.hideRatingModal();

      this.showSubmissionModal();
    },

    showSubmissionModal() {
      this.$refs["ratingSubmissionModal"].show();
    },
    hideRatingModal() {
      this.$refs["ratingModal"].hide();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~vue-progress-path/dist/vue-progress-path.css";
@import "../assets/scss/main.scss";

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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

button .addToCart {
  display: none;
}

button:hover .price {
  display: none;
}

button:hover .addToCart {
  display: inline;
}

button .hoverShow {
  display: none;
}

button:hover .show {
  display: none;
}

button:hover .hoverShow {
  display: inline;
}
</style>
