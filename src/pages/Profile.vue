<template>
  <div>
    <b-card no-body class="flex-row pb-3 mb-2 border-0">
      <b-card-img :src="avatar" class="img-profile pulse" />
      <b-card-body class="pr-0">
        <b-row no-gutters>
          <b-col class="col-auto mr-auto">
            <h2 class="card-title display-2 text-white" style="font-size: 2.25rem;">
              {{ USER.username }}
              <span v-if="USER.role === 'admin'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Mod.png" alt="AdminLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'staff'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Staff.png" alt="StaffLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'Developer'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Dev2.png" alt="DeveloperLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'Streamer'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Streamer.png" alt="StreamerLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'Content-Creator'" class="voxLogoHolder">
                <img src="../assets/icons/contentcreator_badge.png" alt="ContentCreatorBadge" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'Gamer'" class="voxLogoHolder">
                <img src="../assets/icons/gamer_badge.png" alt="GamerBadge" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="USER.role === 'Publisher'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Pub.png" alt="PublisherBadge" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
            </h2>
          </b-col>
          <b-col class="col-auto">
            <!--<b-button id="playButton" v-on:click="play(game.gameId)" variant="outline">-->
            <!-- <img src="../assets/icons/settings.svg" alt="Settings" /> -->
            <router-link :to="{ name: 'userDirectory' }">
              <img height="25px" width="25px" src="../assets/icons/magnify.png" alt="magnifyingGlass" />
            </router-link>
            <!--</b-button>-->
          </b-col>
        </b-row>

        <b-row>
          <b-col title="VoxCoins">
            <img src="../assets/icons/VP_Coin_SVG.svg" class="voxcoin d-inline-block m-auto" alt="VoxCoin" />
            <p class="d-inline-block m-auto pl-2 text-white align-middle" style="font-size: 1.2em;">
              {{ tokens }}
            </p>
          </b-col>
          <b-col>
            <button @click="clearRecommendedGames()">Clear Recommended Games</button>
          </b-col>
        </b-row>

        <p v-if="condition" class="card-subtitle text-white pb-4">
          {{ USER.category }}
          <br />
          <!-- this is where the logo and user role was -->
          {{ USER.role }}
        </p>
        <p class="card-subtitle text-white pb-4 border-bottom">User ID: {{ USER.id }}</p>
      </b-card-body>
    </b-card>

    <b-row class="pb-5 mb-5">
      <b-col class="col-8 mr-auto text-white">
        <p v-if="USER.bio" class="pb-5">
          {{ USER.bio }}
        </p>
        <b-row class="pb-4 mb-3">
          <b-col class="col-8 d-inline mr-auto">
            <h4 class="display-4 d-inline" style="font-size: 1.5rem;">
              Profile statistics
            </h4>
            <div class="d-inline pl-3">
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
              :data="[
                { key: 'test', value: 20 },
                { key: 'test1', value: 50 },
                { key: 'test2', value: 30 }
              ]"
              style="width: auto; height: 184.02px;"
            />
          </b-col>
          <b-col class="col-8 d-inline text-white">
            <!-- <ul class="mt-5 pt-5">
              <li>Downloaded games</li>
              <li>Spent time</li>
              <li>Spent money</li>
            </ul> -->
            <img src="../assets/icons/info_square2.png" alt="infoSquare" />
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-4 d-inline text-white border-left">
        <h4 class="display-4 d-inline" style="font-size: 1.5rem;">
          Friends
        </h4>
        <!-- <span class="d-inline float-right">0</span> -->
        <img class="mt-5" src="../assets/icons/firends_block.png" alt="friendsBlock" />
      </b-col>
    </b-row>

    <b-row class="pb-5 mb-4 border-bottom">
      <b-col>
        <b-row class="pb-2">
          <b-col>
            <h4 class="display-4 d-inline text-white" style="font-size: 1.5rem;">
              File Statistics
            </h4>
          </b-col>
          <b-col cols="1" class="float-right">
            <b-button class="update-button float-right" title="Update statistics" @click="fixAndGetStats"></b-button>
          </b-col>
        </b-row>
        <!--        <b-row v-if="pending.userFilesStatistic && !statistic">-->
        <!--          <b-col>-->
        <!--            Loading...-->
        <!--          </b-col>-->
        <!--        </b-row>-->
        <b-row>
          <b-col>
            <!--            <b-table :fields="statisticFields" :items="statistic" show-empty class="text-white statistic-table"-->
            <!--                     striped @row-clicked="rowStatisticDetailsToggle"-->
            <!--            >-->
            <!--              <template slot="game" slot-scope="row">-->
            <!--                {{ row.value.title }}-->
            <!--              </template>-->
            <!--              <template slot="units" slot-scope="row">-->
            <!--                {{ row.value }}-->
            <!--              </template>-->
            <!--              <template slot="usersCount" slot-scope="row">-->
            <!--                {{ row.value }}-->
            <!--              </template>-->
            <!--              <template slot="row-details" slot-scope="row">-->
            <!--                <b-card no-body class="border-0" style="background-color: #ffffff10">-->
            <!--                  <b-table :fields="statisticGameFields" show-empty :items="row.item.seedingSessions" class="text-white">-->
            <!--                    <template slot="userId" slot-scope="child">-->
            <!--                      Peer{{ child.value }}-->
            <!--                    </template>-->
            <!--                    <template slot="sessionDate" slot-scope="child">-->
            <!--                      {{ child.value | dateFormat('DD MMM YYYY HH:mm') }}-->
            <!--                    </template>-->
            <!--                  </b-table>-->
            <!--                </b-card>-->
            <!--              </template>-->
            <!--            </b-table>-->
            <b-row>
              <b-col>
                <b-row>
                  <b-col>
                    <h4>Master stats</h4>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-table
                      :fields="masterGameStatsFields"
                      :busy="fixStatisticsPending || pending.gamesStatistic"
                      :items="masterGameStats"
                      show-empty
                      class="text-white"
                      striped
                      fixed
                      bordered
                    >
                      <div slot="table-busy" class="text-center text-danger my-2">
                        <b-spinner class="align-middle" />
                        <strong>Loading...</strong>
                      </div>
                      <template slot="game" slot-scope="row">
                        <a :href="getUrlByRoute({ name: 'my-game-details', params: { id: row.value.id } })">{{ row.value.title }}</a>
                      </template>
                      <template slot="countUnique" slot-scope="row">
                        {{ row.value }}
                      </template>
                      <template slot="usersCount" slot-scope="row">
                        {{ row.value }}
                      </template>
                      <template slot="re-downloads" slot-scope="row">
                        {{ row.value }}
                      </template>
                    </b-table>

                    <b-table
                      :fields="masterBytesStatsFields"
                      :busy="fixStatisticsPending || pending.gamesStatistic"
                      :items="masterBytesStats"
                      show-empty
                      class="text-white"
                      striped
                      fixed
                      bordered
                    >
                      <div slot="table-busy" class="text-center text-danger my-2">
                        <b-spinner class="align-middle" />
                        <strong>Loading...</strong>
                      </div>
                      <template slot="game" slot-scope="row">
                        <a :href="getUrlByRoute({ name: 'my-game-details', params: { id: row.value.id } })">{{ row.value.title }}</a>
                      </template>
                      <template slot="countUnique" slot-scope="row">
                        {{ row.value }}
                      </template>
                      <template slot="usersCount" slot-scope="row">
                        {{ row.value }}
                      </template>
                      <template slot="re-downloads" slot-scope="row">
                        {{ row.value }}
                      </template>
                    </b-table>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-row>
                      <b-col>
                        <h4>Peer stats</h4>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <b-table
                          :fields="peerGameStatsFields"
                          :busy="fixStatisticsPending || pending.gamesStatistic"
                          :items="peerGameStats"
                          show-empty
                          class="text-white"
                          striped
                          fixed
                          bordered
                        >
                          <div slot="table-busy" class="text-center text-danger my-2">
                            <b-spinner class="align-middle" />
                            <strong>Loading...</strong>
                          </div>
                          <template slot="game" slot-scope="row">
                            <a :href="getUrlByRoute({ name: 'my-game-details', params: { id: row.value.id } })">{{ row.value.title }}</a>
                          </template>
                          <template slot="countUnique" slot-scope="row">
                            {{ row.value }}
                          </template>
                          <template slot="re-downloads" slot-scope="row">
                            {{ row.value }}
                          </template>
                        </b-table>

                        <b-table
                          :fields="peerBytesStatsFields"
                          :busy="fixStatisticsPending || pending.gamesStatistic"
                          :items="peerBytesStats"
                          show-empty
                          class="text-white"
                          striped
                          fixed
                          bordered
                        >
                          <div slot="table-busy" class="text-center text-danger my-2">
                            <b-spinner class="align-middle" />
                            <strong>Loading...</strong>
                          </div>
                          <template slot="game" slot-scope="row">
                            <a :href="getUrlByRoute({ name: 'my-game-details', params: { id: row.value.id } })">{{ row.value.title }}</a>
                          </template>
                          <template slot="countUnique" slot-scope="row">
                            {{ row.value }}
                          </template>
                          <template slot="re-downloads" slot-scope="row">
                            {{ row.value }}
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <!-- <horizontal-view
      v-if="!pending.games && topGamesStore.content"
      v-once
      title="Your top games"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: 'my-top-games' }"
    > -->
    <horizontal-view
      v-if="!pending.games && topGamesStore.content"
      v-once
      title="Your top games"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: '' }"
    >
      <b-col
        v-for="(game, index) in topGamesStore.content.slice(0, maxElements)"
        :key="index"
        class="px-2 item rounded-lg pb-2"
        :style="{ 'max-width': 100 / maxElements + '%' }"
        tag="a"
        :href="getUrlByRoute({ name: 'my-game-details', params: { id: game.id } })"
      >
        <b-card class="border-0" no-body>
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="getImagePath(game)" :alt="game.title" img-top class="rounded-lg" />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
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

    <!-- <horizontal-view
      v-if="!pending.games && yourFilesStore.content"
      v-once
      title="Your files"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: 'my-files' }"
    > -->
    <horizontal-view
      v-if="!pending.games && yourFilesStore.content"
      v-once
      title="Your files"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: '' }"
    >
      <b-col
        v-for="(game, index) in yourFilesStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{ 'max-width': 100 / maxElements + '%' }"
        tag="a"
        :href="getUrlByRoute({ name: 'my-game-details', params: { id: game.id } })"
      >
        <b-card class="border-0" no-body>
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="getImagePath(game)" :alt="game.title" img-top class="rounded-lg" />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
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

    <horizontal-view
      v-if="!pending.games && yourRecommendationStore.content"
      v-once
      title="Your recommendation"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: 'my-recommendation' }"
    >
      <b-col
        v-for="(game, index) in yourRecommendationStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{ 'max-width': 100 / maxElements + '%' }"
        tag="a"
        :href="getUrlByRoute({ name: 'my-game-details', params: { id: game.id } })"
      >
        <b-card class="border-0" no-body>
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="getImagePath(game)" :alt="game.title" img-top class="rounded-lg" />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
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
    <!--
    <horizontal-view
      v-if="!pending.games && recentlyPlayedStore.content"
      v-once
      title="Recently played"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: 'recently-played' }"
    >
    -->

    <!-- Remove this when fixing -->
    <horizontal-view
      v-if="!pending.games && recentlyPlayedStore.content"
      v-once
      title="Recently played"
      class="text-white pb-5 mb-4 border-bottom"
      title-class="font-weight-normal"
      title-tag="h4"
      :view-all-to="{ name: '' }"
    >
      <b-col
        v-for="(game, index) in recentlyPlayedStore.content.slice(0, maxElements)"
        :key="index"
        class="pl-2 pr-2 item rounded-lg pb-2"
        :style="{ 'max-width': 100 / maxElements + '%' }"
        tag="a"
        :href="getUrlByRoute({ name: 'my-game-details', params: { id: game.id } })"
      >
        <b-card class="border-0" no-body>
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="getImagePath(game)" :alt="game.title" img-top class="rounded-lg" />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
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
    <div v-if="loggedInUserRole == 'Developer' || loggedInUserRole == 'Publisher'">
      <h4 class="text-white font-weight-normal">Sales</h4>
      <b-table hover :items="sales" per-page="5"></b-table>
      <h4 class="text-white font-weight-normal">Total Profit: {{ totalDeveloperProfit }}</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HorizontalView from "../components/View/HorizontalView.vue";
import store from "../mixins/store";
import date from "../mixins/date";
import currency from "../mixins/currency";
import user from "../mixins/user";
import Axios from "axios";

//import { baseURL } from "../apiConfig";
import { USER } from "../store/modules/auth";

export default {
  components: {
    HorizontalView
  },
  mixins: [store, date, currency, user],
  data() {
    return {
      statisticFields: [
        { key: "game", label: "Game" },
        { key: "seededUnitsTotal", label: "Units Count Total" },
        { key: "usersCount", label: "Users Count" }
      ],
      statisticGameFields: [
        { key: "userId", label: "User" },
        { key: "sessionDate", label: "Date" },
        { key: "unitsCount", label: "Units Count" }
      ],
      masterGameStatsFields: [
        { key: "game", label: "Game" },
        { key: "countUnique", label: "Downloads by unique users" },
        // { key: "usersCount", label: "Users downloaded game" },
        { key: "re-downloads", label: "With RE-downloads" }
      ],
      masterBytesStatsFields: [
        { key: "game", label: "Game" },
        { key: "countUnique", label: "Bytes by unique users" },
        // { key: "usersCount", label: "Users downloaded bytes" },
        { key: "re-downloads", label: "With RE-downloads" }
      ],
      peerGameStatsFields: [
        { key: "game", label: "Game" },
        { key: "countUnique", label: "Unique downloads" },
        { key: "re-downloads", label: "With RE-downloads" }
      ],
      peerBytesStatsFields: [
        { key: "game", label: "Game" },
        { key: "countUnique", label: "Unique bytes" },
        { key: "re-downloads", label: "With RE-downloads" }
      ],
      filterStatistics: {
        selected: "day",
        options: [
          {
            value: "day",
            text: "Day"
          },
          {
            value: "Week",
            text: "Week"
          },
          {
            value: "month",
            text: "Month"
          },
          {
            value: "year",
            text: "Year"
          },
          {
            value: "allTime",
            text: "All time"
          }
        ]
      },
      maxElements: 5,
      yourTopGamesCarouselOptions: {
        perPage: 5,
        autoplay: false
      },
      carouselOptions: {
        perPage: 5,
        autoplay: false
      },
      topGamesStore: {
        sort: false,
        content: []
      },
      yourFilesStore: {
        sort: false,
        content: []
      },
      recentlyPlayedStore: {
        sort: false,
        content: []
      },
      yourRecommendationStore: {
        sort: false,
        content: []
      },
      fixStatisticsPending: true,
      sales: []
      //fields: ["userId", "gameTitle", "developerProfit"]
      //totalProfit: 0.0
    };
  },
  computed: {
    ...mapState({
      userFilesStatistic: state => state.userFilesStatistic,
      pending: state => state.pending,
      error: state => state.error,
      gamesStatistics: state => state.gamesStatistics
    }),
    avatar: {
      get() {
        const userAvatar = this[USER] && this[USER].images && this[USER].images.main;
        const userRole = this[USER].role;

        /**
         * "magnet:?xt=urn:btih:0484a3d1e897e56963f37f6aa6227e4208e4f107&dn=packedFortune-499AprilTwentyFourth.exe&ws=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2FTesting-packed-Fortune-499-for-magnet-Link%2F&xs=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2FTesting-packed-Fortune-499-for-magnet-Link%2F1587769871110_packedFortune-499AprilTwentyFourth.exe"
         */

        if (userAvatar) {
          return userAvatar; //returning string directly from AWS
        } else if (userRole == "Developer") {
          return "https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/userAvatars/Developer.jpg";
        } else if (userRole == "Streamer") {
          return "https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/userAvatars/StreamerAvatar.jpg";
        } else if (userRole == "Content-Creator") {
          return "https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/userAvatars/ContentCreator.jpg";
        } else if (userRole == "Gamer") {
          return "https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/userAvatars/gamer.png";
        }
        /**
         * Return 1x1 transparent PNG pixel
         */
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      }
    },
    tokens: {
      get() {
        return this[USER].numberOfTokens || 0;
      }
    },
    condition() {
      return this[USER].role == "admin" || this[USER].role == "staff";
    },
    name: {
      get() {
        return `${this[USER].firstName} ${this[USER].lastName}`;
      }
    },
    peerGameStats: {
      get() {
        return (this.gamesStatistics || []).map(value => {
          return {
            game: value.game,
            countUnique: value.numberOfDownloadedFirstGames || 0,
            "re-downloads": value.numberOfDownloadedAllGames || 0
          };
        });
      }
    },
    peerBytesStats: {
      get() {
        return (this.gamesStatistics || []).map(value => {
          return {
            game: value.game,
            countUnique: value.numberOfDownloadedFirstBytes || 0,
            "re-downloads": value.numberOfDownloadedAllBytes || 0
          };
        });
      }
    },
    masterGameStats: {
      get() {
        return (this.gamesStatistics || []).map(value => {
          return {
            game: value.game,
            countUnique: value.numberOfUploadedFirstGames || 0,
            // usersCount: value.numberOfUploadedFirstGames || 0,
            "re-downloads": value.numberOfUploadedAllGames || 0
          };
        });
      }
    },
    masterBytesStats: {
      get() {
        return (this.gamesStatistics || []).map(value => {
          return {
            game: value.game,
            countUnique: value.numberOfUploadedFirstBytes || 0,
            // usersCount: value.numberOfUploadedFirstGames || 0,
            "re-downloads": value.numberOfUploadedAllBytes || 0
          };
        });
      }
    },
    statistic: {
      get() {
        // let data = [
        //   {
        //     'game': {
        //       gameId: '1',
        //       title: 'Test'
        //     },
        //     seededUnitsTotal: 321,
        //     usersCount: 23,
        //     seedingSessions: [
        //       {
        //         userId: 1,
        //         sessionDate: '2019-02-02',
        //         unitsCount: 222
        //       }
        //     ]
        //   },
        //   {
        //     'game': {
        //       gameId: '2',
        //       title: 'Test1'
        //     },
        //     seededUnitsTotal: 121,
        //     usersCount: 23,
        //     seedingSessions: [
        //       {
        //         userId: 1,
        //         sessionDate: '2019-02-02',
        //         unitsCount: 222
        //       }
        //     ]
        //   }
        // ]

        // const data = this.userFilesStatistic.slice(0);

        for (const item of this.userFilesStatistic) {
          if (typeof item._showDetails === "undefined") {
            this.$set(item, "_showDetails", false);
            // item._showDetails = false;
          }
        }

        return this.userFilesStatistic;
      }
    },
    loggedInUserRole() {
      return this.$store.state.auth.user.role;
    },
    totalDeveloperProfit() {
      var totalProfit = 0.0;

      for (var i = 0; i < this.sales.length; i++) {
        totalProfit += this.sales[i].developerProfit;
      }
      return totalProfit;
    }
  },
  watch: {
    // 'pending.userFilesStatistic'() {
    //   if (!this.pending.userFilesStatistic) {
    //     // this.getData(this.currentStore);
    //   }
    // }
  },
  created() {
    this.getGames();
    this.getUserFilesStatistic();
    this.fixAndGetStats();
    this.$store.dispatch("retrieveRecommendedGames", this.$store.state.auth.user.username); //to load state.recommendedGames with list of recommended games
    console.log("this user is: ", this.$store.state.auth.user);

    let salesParam = {
      username: this.$store.state.auth.user.username
    };

    Axios({ url: "/purchaseTracking/getPurchases", params: salesParam, method: "GET" })
      .then(response => {
        this.sales = response.data;
      })
      .catch(err => {
        console.log("There was an error retrieving sales: ", err);
      });
  },
  methods: {
    ...mapActions(["getUserFilesStatistic", "getGamesStatistics", "fixStatistics"]),
    fixAndGetStats() {
      console.log("Fix and get stats");
      this.fixStatisticsPending = true;

      // this.$store.dispatchPromise("fixStatistics").then((res) => {
      //   console.log(res);
      this.$store.dispatchPromise("getGamesStatistics").then(res => {
        this.fixStatisticsPending = false;
        console.log("getGamesStatistics", res);
      });
      // });
    },
    getUrlByRoute(route) {
      return this.$router.resolve(route).href;
    },
    normalizeOptions(options) {
      return Object.assign({}, options);
    },
    getData() {
      Object.assign(this.topGamesStore, this.$store.getters.getRatingStoreByName("my-top-games"));
      this.storeSort(this.topGamesStore);
      Object.assign(this.yourRecommendationStore, this.$store.getters.getRatingStoreByName("my-recommendation"));
      this.storeSort(this.yourRecommendationStore);
      Object.assign(this.yourFilesStore, this.$store.getters.getRatingStoreByName("my-files"));
      this.storeSort(this.yourFilesStore);
      Object.assign(this.recentlyPlayedStore, this.$store.getters.getRatingStoreByName("recently-played"));
      this.storeSort(this.recentlyPlayedStore);
    },
    rowStatisticDetailsToggle(row) {
      this.$set(row, "_showDetails", !row._showDetails);
    },
    clearRecommendedGames() {
      let params = {
        username: this.$store.state.auth.user.username
      };
      console.log("username: ", params.username);
      this.$store.dispatch("clearRecommendedGames", params);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/scss/partials/store";

.update-button {
  &:before {
    content: "\21BB";
  }
}

/deep/ .statistic-table > tbody > [role="row"]:not(.b-table-details) {
  cursor: pointer;
}

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
  font-size: 1.75rem;
}

.img-profile,
.card-img-left {
  //background: url("../assets/icons/noAvatarPlaceholder.jpg");
  //background: transparent;
  background-size: 100% 100%;
  height: 140px;
  width: 140px;
  border-radius: 50%;
  /*   margin: 10px auto; */
}

/*tr:focus {
    outline: 0;
  }
  tr:hover {
    cursor: pointer;
  }*/

.pulse {
  box-shadow: 0 0 0 0 #696e80;
  animation: pulse 1.5s 1 cubic-bezier(0.66, 0, 0, 1);
}

.voxcoin {
  width: 20px;
  height: 20px;
  position: relative;
  top: -2px;
}

.voxlogo {
  width: 30px;
  height: 30px;
  bottom: 3px;
  position: relative;
}

.voxlogoHolder {
  padding-bottom: 10px;
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
  }
}
</style>
