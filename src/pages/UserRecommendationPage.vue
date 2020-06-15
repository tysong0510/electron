<template>
  <div>
    <b-row class="mt-1 mb-4 pb-2">
      <b-col>
        <router-link :to="{ name: 'userDirectoryProfile', params: { user: user } }">
          <div
            class="d-inline-block"
            style="border-left: 1px solid; border-bottom: 1px solid; border-radius: 1px; height: .6em; width: .6em; transform: matrix(1, 1, -1, 1, 0, 0);"
          />
          Back to {{ user.username }}'s profile
        </router-link>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <h2 class="text-white font-weight-normal">{{ user.username }}'s Recommended Games</h2>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row>
      <b-col v-for="(game, index) in recommendedGames.slice(0, 3)" :key="index" class="p-2 rounded-lg game mb-4 mt-2" tag="a">
        <router-link class="float-right view-all text-muted" :to="{ name: 'game-details', params: { id: game.id, userId: user.id } }">
          <b-card class="border-0" no-body>
            <b-row>
              <b-col class="col-img" cols="12">
                <b-row class="h-100">
                  <b-col class="m-auto">
                    <b-card-img :src="game.images.main" class="rounded-lg" />
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12">
                <b-card-body class="p-0 pt-2">
                  <b-card-title class="font-weight-normal" title-tag="h5">
                    {{ game.title }}
                  </b-card-title>

                  <b-card-sub-title class="font-weight-normal mt-2" sub-title-tag="h6">
                    <b-row>
                      <b-col class="text-white">
                        {{ game.price | currency(game.currency) }}
                      </b-col>
                    </b-row>
                  </b-card-sub-title>

                  <!-- <template >
                  <b-card-sub-title class="font-weight-normal mt-2" sub-title-tag="h6">
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
                      <b-col> {{ game.size }} {{ game.sizeUnit }} </b-col>
                    </b-row>
                  </b-card-text>
                </template> -->
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </router-link>
      </b-col>
    </b-row>

    <b-row v-for="(game, index) in recommendedGames.slice(3)" :key="index" class="border-bottom limited-height-row mt-3 pb-3">
      <b-col :key="index" class="p-2 rounded-lg game mt-1 mb-1" tag="a">
        <router-link class="float-right view-all text-muted" :to="{ name: 'game-details', params: { id: game.id, userId: user.id } }">
          <b-card class="border-0" no-body>
            <b-row>
              <b-col class="m-auto text-center" cols="2">
                <b-card-img :src="game.images.main" class="rounded-lg" />
              </b-col>
              <b-col>
                <b-card-body class="p-0">
                  <b-card-title class="font-weight-normal" title-tag="h5">
                    {{ game.title }}
                  </b-card-title>
                  <b-card-text class="font-weight-normal mt-2 col-7 p-0 text-muted">
                    <b-row>
                      <b-col>
                        {{ game.price | currency(game.currency) }}
                      </b-col>
                    </b-row>

                    <!-- <template v-else-if="currentStore === 'recently-played'">
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
                      <b-col> {{ game.size }} {{ game.sizeUnit }} </b-col>
                    </b-row>
                  </template> -->
                  </b-card-text>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//import Axios from "axios"
import currency from "../mixins/currency";

export default {
  name: "UserRecommendationPage",
  mixins: [currency],
  data() {
    return {};
  },
  computed: {
    user() {
      console.log("params data: ", this.$route);
      console.log("router: ", this.$router);
      return this.$route.params.recoUser;
    },
    recommendedGames() {
      return this.$route.params.recommendedGames;
    }
  }
  // created() {
  //   console.log("user logged in now: ", this.$store.state.auth.user.role);
  //   let recommendedParams = {
  //     username: this.$route.params.user.username
  //   };
  //   Axios({ url: "/recommendedGames", params: recommendedParams, method: "GET" })
  //     .then(async resp => {
  //       console.log("data gotten from recommendedGames: ", resp.data);
  //       this.recommendedGames = resp.data;
  //       // this.maxElements = this.recommendedGames.length;
  //       // console.log("value of maxElements: ", this.maxElements);
  //     })
  //     .catch(err => {
  //       console.log("Error retrieving data from recommendedGames: ", err);
  //       this.recommendedGames = [];
  //     });
  // },
};
</script>

<style scoped></style>
