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
    <span v-if="pending.games">
      Loading...
    </span>
    <span v-else-if="error.games">
      {{ error.games }}
    </span>
    <template v-else>
      <b-row>
        <b-col>
          <b-row>
            <b-col>
              <h2>{{ storeTitle }}</h2>
              <!-- This needs to be passed to game details to allow returning back to the proper store -->
            </b-col>
            <b-col v-if="filter" cols="4">
              <b-select v-model="filterSelected" :options="filter.options" class="filter-period text-white" />
            </b-col>
            <b-col v-if="filter" />
          </b-row>
        </b-col>
        <b-col v-if="filter" />
      </b-row>
      <b-row class="border-bottom">
        <b-col
          v-for="(game, index) in content.slice(0, 3)"
          :key="currentStore + index"
          class="p-2 rounded-lg game mb-4 mt-2"
          tag="a"
          :href="$router.resolve({ name: 'game-details', params: { id: game.id } }).href"
        >
          <b-card no-body class="border-0">
            <b-row>
              <b-col cols="12" class="col-img">
                <b-row class="h-100">
                  <b-col class="m-auto">
                    <b-card-img :src="getImagePath(game)" class="rounded-lg" />
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12">
                <b-card-body class="p-0 pt-2">
                  <b-card-title title-tag="h5" class="font-weight-normal">
                    {{ game.title }}
                  </b-card-title>
                  <b-card-sub-title title-tag="h6" class="font-weight-normal">
                    <b-row>
                      <b-col v-if="game.price != 500 && game.price != 250" class="text-white">
                        {{ game.price | currency }}
                      </b-col>
                      <b-col class="downloaded" :title="'Downloaded ' + (game.downloaded || 0) + ' times'">
                        <img src="../assets/icons/downloaded.svg" alt="Downloaded" />
                        {{ game.downloaded || 0 }}
                      </b-col>
                    </b-row>
                  </b-card-sub-title>
                  <b-card-text class="font-weight-normal mt-3">
                    {{ textCutter(game.description) }}
                    <b-link
                      v-if="textCutter(game.description).length > 140"
                      class="text-primary"
                      :href="$router.resolve({ name: 'game-details', params: { id: game.id } }).href"
                    >
                      More
                    </b-link>
                  </b-card-text>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-for="(game, index) in content.slice(3)" :key="currentStore + index" class="border-bottom limited-height-row mt-3 pb-3">
        <b-col
          :key="index"
          class="p-2 rounded-lg game mt-1 mb-1"
          tag="a"
          :href="$router.resolve({ name: 'game-details', params: { id: game.id } }).href"
        >
          <b-card no-body class="border-0">
            <b-row>
              <b-col cols="2" class="m-auto text-center">
                <b-card-img :src="getImagePath(game)" class="rounded-lg" />
              </b-col>
              <b-col>
                <b-card-body class="p-0">
                  <b-card-title title-tag="h5" class="font-weight-normal mb-2">
                    {{ game.title }}
                  </b-card-title>
                  <b-row>
                    <b-col cols="4">
                      <b-card-sub-title sub-title-tag="div" class="font-weight-normal mt-0" style="font-size: 14px;">
                        <b-row>
                          <b-col v-if="game.price != 500 && game.price != 250" class="text-white">
                            {{ game.price | currency }}
                          </b-col>
                          <b-col class="downloaded" :title="'Downloaded ' + (game.downloaded || 0) + ' times'">
                            <img src="../assets/icons/downloaded.svg" alt="Downloaded" />
                            {{ game.downloaded || 0 }}
                          </b-col>
                        </b-row>
                      </b-card-sub-title>
                    </b-col>
                    <b-col>
                      <b-card-text class="font-weight-normal p-0 mt-0">
                        {{ textCutter(game.description) }}
                        <b-link
                          v-if="textCutter(game.description).length > 140"
                          class="text-primary"
                          :href="$router.resolve({ name: 'game-details', params: { id: game.id } }).href"
                        >
                          More
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
    </template>
  </div>
</template>

<script>
import store from "../mixins/store";
import currency from "../mixins/currency";
import user from "../mixins/user";
import axios from "axios";
const { ipcRenderer } = require("electron");

let colCounter = 0;

export default {
  // components: {
  //   GameCarousel
  // },
  mixins: [store, currency, user],
  data() {
    return {
      name: "Store",
      filterSelected: "day",
      storeTitle: "",
      store: null,
      filter: null,
      firstTime: true
    };
  },
  computed: {
    content: {
      get() {
        if (!this.store) {
          this.getData(this.currentStore);
        }

        if (this.store && this.store.hasOwnProperty("content")) {
          if (this.filter) {
            return this.store.content[this.filterSelected] || [];
          }
          if (Array.isArray(this.store.content)) {
            return this.store.content;
          }
          return this.store.content[Object.keys(this.store.content).pop()];
        }
        return [];
      }
    }
  },
  watch: {
    "pending.featuredGames": function() {
      if (!this.pending.featuredGames && this.currentStore === "store-featured") {
        this.getData(this.currentStore);
      }
    },
    "pending.topGames": function() {
      if (!this.pending.topGames && this.currentStore === "store-top") {
        this.getData(this.currentStore);
      }
    }
  },
  mounted() {},
  created() {
    this.getGames();

    if (this.currentStore === "store-featured") {
      console.log("store-featured: ", this.currentStore);
      this.getFeatured();
      console.log("this.getFeatured(): ", this.getFeatured());
    } else if (this.currentStore === "store-top") {
      this.getTopGames();
    } else if (this.currentStore === "store-coming-soon") {
      console.log("this store is coming soon store...");
      console.log("store: ", this.currentStore);
      this.getComingSoon();
    }

    ipcRenderer.on("info", (event, data) => {
      console.log("event: ", event);
      console.log("data: ", data);
      var i = 0;

      if (this.$route.name !== "store-top") {
        console.log("heading to store top");
        this.$router.push({ name: "store-top" });
      }
      // this.$router.push({ name: "userDirectory" });

      //if (this.firstTime) {
      axios
        .get("/auth/external/link/users")
        .then(response => {
          console.log("inside axios then...");
          var users = response.data;

          var selectedUser = null;
          while (i < users.length) {
            if (users[i].username == data) {
              console.log("FOUND USER: ", users[i]);
              console.log("this.$router.push: ", this.$router.push({ name: "userDirectoryProfile", params: { user: users[i] } }));
              console.log("route1: ", this.$route);
              selectedUser = users[i];
              console.log("selectedUser variable: ", selectedUser);
              this.$router.push({ name: "userDirectoryProfile", params: { user: selectedUser } }).catch(err => {
                //this.$router.go(-1);
                //this.$forceUpdate();
                console.log("error pushing to route: ", err);
              });

              console.log("route2: ", this.$route);

              i = users.length;
            } else {
              //console.log("not selected user: ", users[i].username);
              i++;
            }
          }
        })
        .catch(e => {
          console.log("error retrieving users: ", e);
        });
      console.log("router: ", this.$router);

      //this.firstTime = false;
      //}
    });
  },
  beforeDestroy() {},
  methods: {
    getCols(index) {
      if (index === 0) {
        colCounter = 0;
      }

      colCounter += 1;

      if (colCounter < 4) {
        return "4";
      }
      return "2_5";
    },
    textCutter(text = null) {
      let initial = new DOMParser().parseFromString(text, "text/html").body.textContent;
      let cuttedText = "";

      if (initial && initial.length > 140) {
        cuttedText = initial.replace(/(([\S\s]{140})[\S\s]*)/gm, "$2").replace(/[.,\s]*?$/, "...");
      } else {
        cuttedText = initial || "";
      }

      return cuttedText;
    },
    getData(storeName) {
      const store = this.$store.getters.getRatingStoreByName(storeName) || {};

      this.storeTitle = store.title;

      console.log("store title: ", this.storeTitle);

      if (!["store-featured", "store-top", "store-coming-soon"].includes(storeName)) {
        const filter = this.$store.getters.getFilterByName(storeName);
        if (filter) {
          this.filter = filter;
          this.filterSelected = this.filter.default;
        }

        this.storeSort(store);
      }

      if (storeName === "store-featured") {
        console.log("store name is featured...");
        if (!this.pending.featuredGames) {
          store.content = this.featuredGames || [];
          console.log("featured games: ", this.featuredGames);
        }
      } else if (storeName === "store-top") {
        if (!this.pending.topGames) {
          store.content = this.topGames || [];
        }
      } else if (storeName == "store-coming-soon") {
        this.storeTitle = "Coming Soon";
        store.content = this.comingSoon || [];
      }

      this.store = store;
    }
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
    height: auto;
    max-height: 280px;

    img {
      max-height: 280px;
    }
  }

  &:hover {
    background-color: $block-hover-background-color;
  }
}

.limited-height-row {
  max-height: 300px;

  .game {
    img {
      max-height: 300px;
      max-width: 300px;
    }
  }
}

.col-2_5 {
  -webkit-box-flex: 0;
  flex: 0 0 20%;
  max-width: 20%;
}

@media (max-width: 2000px) {
  .game {
    .col-img {
      height: 200px;
      max-height: 200px;

      img {
        max-height: 200px;
      }
    }
  }

  .limited-height-row {
    max-height: 180px;

    .game {
      img {
        max-height: 150px;
        max-width: 220px;
      }
    }
  }
}

@media (max-width: 1500px) {
  .game {
    .col-img {
      height: 140px;
      max-height: 140px;

      img {
        max-height: 140px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .game {
    .col-img {
      height: 130px;
      max-height: 130px;

      img {
        max-height: 130px;
      }
    }
  }
}

@media (max-width: 968px) {
  .game {
    .col-img {
      height: 120px;
      max-height: 120px;

      img {
        max-height: 120px;
      }
    }
  }
}
</style>
