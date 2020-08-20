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

            <b-row>
              <b-col title="VoxCoins">
                <img
                  v-b-popover.hover="'Popover!'"
                  src="../assets/icons/VP_Coin_SVG.svg"
                  class="voxcoin d-inline-block m-auto"
                  alt="VoxCoin"
                />
                <p class="d-inline-block m-auto pl-2 text-white align-middle" style="font-size: 1.2em;">
                  <!-- {{ tokens | currency("USD") }} -->
                  {{ voxcoins }}
                </p>
              </b-col>
            </b-row>

            <p v-if="condition" class="card-subtitle text-white pb-4">
              {{ USER.category }}
              <br />
              <!-- this is where the logo and user role was -->
              {{ USER.role }}
            </p>

            <p class="card-subtitle text-white pb-4">User ID: {{ USER.id }}</p>
          </b-col>
          <b-col class="ml-5 text-white">
            <h2 class="display-2 " style="font-size: 1.40rem;">About Me:</h2>
            <p v-if="USER.bio">
              <span v-html="description(USER.bio)"></span>
            </p>
          </b-col>
          <b-col class="col-auto">
            <b-row>
              <b-button id="playButton" variant="outline" @click="showModal()">
                <img src="../assets/icons/settings.svg" alt="Settings" />
              </b-button>
            </b-row>

            <b-row class="p-2">
              <router-link :to="{ name: 'userDirectory' }">
                <img height="25px" width="25px" src="../assets/icons/magnify.png" alt="magnifyingGlass" />
              </router-link>
            </b-row>
          </b-col>
        </b-row>

        <b-dropdown variant="outline-secondary">
          <template v-slot:button-content><b-icon-box-arrow-down font-scale="2"></b-icon-box-arrow-down> External URL </template>
          <b-dropdown-text>{{ url }}invite/{{ username }}</b-dropdown-text>
        </b-dropdown>
        <br />
        <p class="border-bottom"></p>
      </b-card-body>
    </b-card>

    <!-- <b-row class="pb-5 mb-5"> 
      <b-col class="text-white">
         <p v-if="USER.bio" >
         
          <h4> Bio: </h4>
         
         <span v-html="description(USER.bio)"></span>
        
        </p>
      </b-col>
    </b-row> -->

    <div v-if="yourRecommendationStore.content" class="m-3">
      <b-row>
        <b-col>
          <h4 class="text-white font-weight-normal">Recommended Games</h4>
        </b-col>
        <b-col>
          <router-link class="float-right view-all text-muted" :to="{ name: 'my-recommendation' }">
            View All
          </router-link>
        </b-col>
      </b-row>

      <b-row class="border-bottom limited-height-row mt-3 pb-3">
        <b-col
          v-for="(game, index) in yourRecommendationStore.content.slice(0, maxElements)"
          :key="index"
          class="p-2 rounded-lg game mt-1 mb-1 testing"
          tag="a"
        >
          <router-link class="float-right view-all text-muted" :to="{ name: 'game-details', params: { id: game.id, user: user } }">
            <b-card class="border-0" no-body>
              <b-card-body class="p-0">
                <b-row class="game-image">
                  <b-col class="h-100 m-auto">
                    <b-card-img :src="game.images.main" :alt="game.title" img-top class="rounded-lg" />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
                      {{ game.title }}
                    </b-card-title>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </router-link>
        </b-col>
      </b-row>
    </div>

    <div v-else class="border-bottom">
      <h4 class="text-white font-weight-normal">Recommended Games</h4>
      <p>No Recommended Games...</p>
    </div>

    <b-row class="pb-5 mb-5">
      <b-col class="col-8 mr-auto text-white">
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
        <h4 class="display-4 d-inline" style="font-size: 1.5rem;">Friends: {{ numOfFriends }}</h4>
        <!-- <span class="d-inline float-right">0</span> -->
        <img class="mt-5" src="../assets/icons/firends_block.png" alt="friendsBlock" />
        <!-- <div v-if="numOfFriends < 1">
          <p>Go and make some friends!</p>
        </div>
        <div v-else>
         
        </div> -->
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

    <!-- <horizontal-view
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
    </horizontal-view> -->

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

    <b-modal id="settingsModal" ref="settingsModal" class="settingsModal" centered hide-footer title="Settings">
      <b-row class="border-bottom border-top limited-height-row mt-3 pb-3 ">
        <b-col class="p-2 rounded-lg mt-1">
          <b-button v-b-modal.personalInfoModal variant="link"
            >Edit personal information
            <b-icon-chevron-right></b-icon-chevron-right>
          </b-button>
        </b-col>
      </b-row>
      <b-row class="border-bottom limited-height-row mt-3 pb-3">
        <b-col class="p-2 rounded-lg mt-1">
          <b-button variant="link" @click="clearRecommendedGames()">Clear All Recommended Games </b-button>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal id="personalInfoModal" ref="personalInfoModal" centered hide-footer title="Edit Personal Information">
      <b-row>
        <b-col>
          <b-row class="p-5">
            <b-col class="text-center">
              <b-form id="personalInfo" @submit.prevent="personalInfo">
                <b-form-group
                  label="Change Avatar Photo (Images should be as close to 1:1 for best fit):"
                  label-for="avatarPhoto"
                  class="text-left"
                >
                  <b-form-file
                    v-model="avatarPhoto"
                    accept="image/*"
                    placeholder="Choose Image"
                    drop-placeholder="Drop Image here..."
                  ></b-form-file>
                </b-form-group>
                <b-form-group label="Bio: " class="text-left">
                  <div class="editor">
                    <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
                      <div class="menubar text-left">
                        <button class="menubar__button" :class="{ 'is-active': isActive.bold() }" type="button" @click="commands.bold">
                          <b-icon-type-bold></b-icon-type-bold>
                        </button>

                        <button class="menubar__button" :class="{ 'is-active': isActive.italic() }" type="button" @click="commands.italic">
                          <b-icon-type-italic></b-icon-type-italic>
                        </button>

                        <button class="menubar__button" :class="{ 'is-active': isActive.strike() }" type="button" @click="commands.strike">
                          <b-icon-type-strikethrough></b-icon-type-strikethrough>
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.underline() }"
                          type="button"
                          @click="commands.underline"
                        >
                          <b-icon-type-underline></b-icon-type-underline>
                        </button>

                        <button class="menubar__button" :class="{ 'is-active': isActive.code() }" type="button" @click="commands.code">
                          <b-icon-code></b-icon-code>
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.paragraph() }"
                          type="button"
                          @click="commands.paragraph"
                        >
                          p
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                          type="button"
                          @click="commands.heading({ level: 1 })"
                        >
                          H1
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                          type="button"
                          @click="commands.heading({ level: 2 })"
                        >
                          H2
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                          type="button"
                          @click="commands.heading({ level: 3 })"
                        >
                          H3
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.bullet_list() }"
                          type="button"
                          @click="commands.bullet_list"
                        >
                          <b-icon-list-ul></b-icon-list-ul>
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.ordered_list() }"
                          type="button"
                          @click="commands.ordered_list"
                        >
                          <b-icon-list-ol></b-icon-list-ol>
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.blockquote() }"
                          type="button"
                          @click="commands.blockquote"
                        >
                          <b-icon-blockquote-left></b-icon-blockquote-left>
                        </button>

                        <button
                          class="menubar__button"
                          :class="{ 'is-active': isActive.code_block() }"
                          type="button"
                          @click="commands.code_block"
                        >
                          <b-icon-code-slash></b-icon-code-slash>
                        </button>

                        <button class="menubar__button" type="button" @click="commands.horizontal_rule">
                          <b-icon-type-underline></b-icon-type-underline>
                        </button>

                        <button class="menubar__button" type="button" @click="commands.undo">
                          <b-icon-arrow-counterclockwise></b-icon-arrow-counterclockwise>
                        </button>

                        <button class="menubar__button" type="button" @click="commands.redo">
                          <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
                        </button>
                      </div>
                    </editor-menu-bar>
                    <editor-content class="editor__content" :editor="editor" :v-model="description" :maxlength="20" />
                    <!-- <div> {{editor.length / max}} </div> -->
                  </div>
                </b-form-group>
              </b-form>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="w-100 d-flex">
              <b-button
                size="lg"
                variant="primary"
                class="btn-auth"
                style="min-width: 180px; margin: 0 auto;"
                type="submit"
                form="personalInfo"
                :disabled="loading"
              >
                <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Save</span>
                <b-spinner v-else></b-spinner>
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal id="submissionModal" ref="submissionModal" class="submissionModal" centered hide-footer title="Submission Successful">
      <b-row class="border-bottom border-top limited-height-row mt-3 pb-3 ">
        <b-col class="p-2 rounded-lg mt-1">
          <h2>Your submission is Successful</h2>
        </b-col>
      </b-row>
    </b-modal>
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
import axios from "axios";
import { baseURL } from "../apiConfig";
import { USER } from "../store/modules/auth";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from "tiptap-extensions";

import aws from "aws-sdk";
//import winreg from "winreg";
// import regedit from "regedit";
// regedit.setExternalVBSLocation("resources/regedit/vbs");
import fs from "fs";
import path from "path";
import { remote } from "electron";
const USER_DATA_PATH = remote.app.getPath("userData");

aws.config.update({
  accessKeyId: "AKIASKCWLEX6DIWB2K4E",
  secretAccessKey: "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",
  region: "us-east-2"
});

export default {
  components: {
    HorizontalView,
    EditorContent,
    EditorMenuBar
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
      sales: [],
      numOfFriends: 0,
      //fields: ["userId", "gameTitle", "developerProfit"]
      //totalProfit: 0.0
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        onUpdate: ({ getHTML }) => {
          this.html = getHTML();
        }
      }),
      html: "",
      avatarPhoto: null,
      loading: false,
      max: 20
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
    },
    url() {
      return baseURL;
    },
    voxcoins() {
      // return Number.parseFloat(this[USER].numberOfTokens) || 0
      var coins = this[USER].numberOfTokens;
      coins *= 100;
      //return coins.toFixed(2);
      return Math.floor(coins);
    },
    username() {
      var username = this[USER].username;

      console.log(username);

      // if (username.contains(" ")) {
      //   username = username.replace(/\s/g, "");

      //   return username;
      // }

      username = username.replace(/\s/g, "");

      return username;
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

    console.log("is this user authorized: ", this.$store.getters["isAuthorized"]);
    console.log("value of this.auth: ", this.$store.state.auth);

    // if (process.platform == "win32") {
    //   regedit.createKey(["HKCU\\SOFTWARE\\VoxPop Games\\Credentials"], (err, data) => {
    //     if (err) {
    //       console.log("There was an error creating Registry key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", err);
    //     } else {
    //       console.log("value of auth userCredentials: ", this.$store.state.auth.userCredentials);

    //       var username = this.$store.state.auth.userCredentials.username;
    //       var password = this.$store.state.auth.userCredentials.password;

    //       console.log("What is the value of username: ", username);
    //       console.log("What is the value of password: ", password);

    //       regedit.putValue(
    //         {
    //           "HKCU\\SOFTWARE\\VoxPop Games\\Credentials": {
    //             username: {
    //               value: username,
    //               type: "REG_EXPAND_SZ"
    //             },

    //             password: {
    //               value: password,
    //               type: "REG_EXPAND_SZ"
    //             }
    //           }
    //         },
    //         err => {
    //           if (err) {
    //             console.log("There was an error submitting values to key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", err);
    //           }
    //         }
    //       );

    //       console.log(
    //         "regedit put data: ",
    //         regedit.putValue(
    //           {
    //             "HKCU\\SOFTWARE\\VoxPop Games\\Credentials": {
    //               username: {
    //                 value: username,
    //                 type: "REG_EXPAND_SZ"
    //               },

    //               password: {
    //                 value: password,
    //                 type: "REG_EXPAND_SZ"
    //               }
    //             }
    //           },
    //           err => {
    //             if (err) {
    //               console.log("There was an error submitting values to key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", err);
    //             }
    //           }
    //         )
    //       );

    //       console.log("Response to creating key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", data);
    //     }
    //   });
    // }

    this.createCredentials();
  },
  methods: {
    ...mapActions(["getUserFilesStatistic", "getGamesStatistics", "fixStatistics"]),
    fixAndGetStats() {
      this.fixStatisticsPending = true;

      // this.$store.dispatchPromise("fixStatistics").then((res) => {
      //   console.log(res);
      this.$store.dispatchPromise("getGamesStatistics").then(() => {
        this.fixStatisticsPending = false;
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
    },
    showModal() {
      console.log("inside show modal");
      this.$refs["settingsModal"].show();
    },
    async personalInfo() {
      this.load = true;
      console.log("inside change personal info");
      console.log("html variable: ", this.html);
      console.log("avatar photo: ", this.avatarPhoto);

      if (this.html || this.avatarPhoto) {
        var avatarPhotoURL = null;

        if (this.avatarPhoto) {
          avatarPhotoURL = await this.uploadSingleFileToS3(this.$store.state.auth.user.username, this.avatarPhoto, this.avatarPhoto.name);
        }

        console.log("avatarPhotoURL: ", avatarPhotoURL);

        const formData = new FormData();
        formData.append("username", this.$store.state.auth.user.username);
        formData.append("bio", this.html);
        formData.append("avatarPhoto", avatarPhotoURL);

        try {
          await axios.post("/users/updateUserInfo", formData);
        } catch (err) {
          console.log("There was an error updating user info: ", err);
        }
        this.loading = false;
        this.hidePersonalModal();
        this.showSubmissionModal();
      } else {
        this.load = false;
      }
    },
    showSubmissionModal() {
      this.$refs["submissionModal"].show();
    },
    hidePersonalModal() {
      this.$refs["personalInfoModal"].hide();
    },
    async uploadSingleFileToS3(username, file, name) {
      return new Promise(async function(resolve, reject) {
        var date = new Date();
        var s3 = new aws.S3();

        // var concatenatedTitleName = title;
        // concatenatedTitleName = concatenatedTitleName.replace(/ /g, "-");

        console.log("name inside upload function: ", name);
        var regName = name;
        console.log("regName: ", regName);
        var concatName = regName.replace(/ /g, "-");

        await s3.upload(
          {
            Bucket: "voxpop-image-bucket",
            Key: username + "/" + date.getTime() + "_" + concatName,
            Body: file,
            ACL: "public-read"
          },
          function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
              console.log("upload complete");
            }
          }
        );
      });
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
    createCredentials() {
      const credentialsPath = path.join(USER_DATA_PATH, "credentials.txt");

      //this.mkdirDeep(credentialsPath);

      var username = this.$store.state.auth.userCredentials.username;
      var password = this.$store.state.auth.userCredentials.password;

      let data = {
        username: username,
        password: password
      };

      const credentials = JSON.stringify(data);

      fs.writeFile(credentialsPath, credentials, err => {
        if (err) {
          console.log("There was an error writing file: ", err);
        } else {
          console.log("Credentials written successfully to: ", credentialsPath);
        }
      });
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

.menubar__button {
  background: transparent;
  color: #696e80;
  text-align: left;
}

.is-active {
  background-color: white;
}

.editor__content {
  border: solid #696e80 1px;
  height: 250px;
  position: relative;
}

.ProseMirror {
  outline-color: white;
  height: 250px;
  text-align: left;
  overflow: auto;
}

.ProseMirror p {
  margin-left: 10px;
}

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Browse Files";
  color: #696e80;
  background-color: transparent;
}

.input-group-text {
  background-color: transparent;
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
  }
}
</style>
