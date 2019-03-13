<template>
  <div>
    <b-card no-body class="flex-row pb-3 mb-2">
      <b-card-img src="https://picsum.photos/400/400/?image=20" class="img-profile pulse"/>
      <b-card-body class="pr-0">
        <b-row no-gutters>
          <b-col class="col-auto mr-auto">
            <h2 class="card-title display-2 text-white" style="font-size: 2.25rem;">
              {{user.username}}
            </h2>
          </b-col>
          <b-col class="col-auto">
            <!--<b-button id="playButton" v-on:click="play(game.gameId)" variant="outline">-->
            <img src="../assets/icons/settings.svg" alt="Settings"/>
            <!--</b-button>-->
          </b-col>
        </b-row>

        <p class="card-subtitle text-white pb-4 border-bottom">
          {{user.category}}
        </p>
      </b-card-body>
    </b-card>

    <b-row class="pb-5 mb-5 border-bottom">
      <b-col class="col-8 mr-auto text-white">
        <p v-html="user.bio" class="pb-5"></p>

        <b-row class="pb-4 mb-3">
          <b-col class="col-8 d-inline mr-auto">
            <h4 class="display-4 d-inline" style="font-size: 1.5rem;">Profile statistic</h4>
            <div class="d-inline pl-5">
              <b-select class="filter-period w-auto text-white font-weight-light" :options="filterStatistics.options"
                        v-model="filterStatistics.selected"/>
            </div>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="col-4 d-inline mr-auto">
            <d3-pie
              :data="[{key: 'test', value: 20}, {key: 'test1', value: 50}, {key: 'test2', value: 30}]"
              style="width: auto; height: 184.02px;"/>
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
        <h3 class="d-inline">Friends</h3>
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

    <horizontal-view title="Your top games"
                     class="text-white pb-5 mb-4 border-bottom"
                     title-class="font-weight-normal"
                     title-tag="h4"
                     :view-all-to="{name: 'my-top-games'}" v-once>
      <b-col v-for="(game, index) in topGamesStore.content.slice(0, maxElements)" :key="index"
             class="pl-2 pr-2 item rounded-lg pb-2"
             :style="{'max-width': (100 / maxElements) + '%'}" tag="a"
             :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})">
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="game.img" :alt="game.title" img-top class="rounded-lg"></b-card-img>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price }}
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

    <horizontal-view title="Your files"
                     class="text-white pb-5 mb-4 border-bottom"
                     title-class="font-weight-normal"
                     title-tag="h4"
                     :view-all-to="{name: 'my-files'}" v-once>
      <b-col v-for="(game, index) in yourFilesStore.content.slice(0, maxElements)" :key="index"
             class="pl-2 pr-2 item rounded-lg pb-2"
             :style="{'max-width': (100 / maxElements) + '%'}" tag="a"
             :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})">
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="game.img" :alt="game.title" img-top class="rounded-lg"></b-card-img>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price }}
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

    <horizontal-view title="Your recommendation"
                     class="text-white pb-5 mb-4 border-bottom"
                     title-class="font-weight-normal"
                     title-tag="h4"
                     :view-all-to="{name: 'my-recommendation'}" v-once>
      <b-col v-for="(game, index) in yourRecommendationStore.content.slice(0, maxElements)" :key="index"
             class="pl-2 pr-2 item rounded-lg pb-2"
             :style="{'max-width': (100 / maxElements) + '%'}" tag="a"
             :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})">
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="game.img" :alt="game.title" img-top class="rounded-lg"></b-card-img>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-card-title title-tag="h4" class="mb-2" style="font-size: .85em;">
                  {{ game.title }}
                </b-card-title>
                <b-card-text style="font-size: 0.7em;">
                  {{ game.price }}
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

    <horizontal-view title="Recently played"
                     class="text-white pb-5 mb-4 border-bottom"
                     title-class="font-weight-normal"
                     title-tag="h4"
                     :view-all-to="{name: 'recently-played'}" v-once>
      <b-col v-for="(game, index) in recentlyPlayedStore.content.slice(0, maxElements)" :key="index"
             class="pl-2 pr-2 item rounded-lg pb-2"
             :style="{'max-width': (100 / maxElements) + '%'}" tag="a"
             :href="getUrlByRoute({name: 'my-game-details', params: {id: game.id}})">
        <b-card
          class="border-0"
          no-body
        >
          <b-card-body class="p-0">
            <b-row class="game-image">
              <b-col class="h-100 m-auto">
                <b-card-img :src="game.img" :alt="game.title" img-top class="rounded-lg"></b-card-img>
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

  </div>
</template>

<script>
  // import GameCarousel from '../components/Carousel/GameCarousel';
  import HorizontalView from '../components/View/HorizontalView';
  import {store} from "../mixins/store";
  import {date} from "../mixins/date";

  export default {
    components: {
      // GameCarousel,
      HorizontalView
    },
    mixins: [store, date],
    computed: {},
    created() {
      this.getData();
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
      // storeSort(store) {
      //   if (store.hasOwnProperty('sort') && store.sort !== undefined && !store.sort) {
      //     return;
      //   }
      //
      //   let orderVector = 0;
      //   let byField = store.byField || 'rating';
      //   let order = store.order || 'DESC';
      //
      //   switch (order) {
      //     case 'ASC':
      //       orderVector = 1;
      //       break;
      //     case 'DESC':
      //     default:
      //       orderVector = -1;
      //   }
      //
      //   if (store && store.content && !Array.isArray(store.content)) {
      //     for (let key in store.content) {
      //       if (store.content.hasOwnProperty(key)) {
      //         store.content[key].sort((a, b) => {
      //           return (a[byField] - b[byField]) * (orderVector);
      //         });
      //       }
      //     }
      //   } else {
      //     store.content.sort((a, b) => {
      //       return (a[byField] - b[byField]) * (orderVector);
      //     });
      //   }
      // },
    },
    data() {
      return {
        filterStatistics: {
          selected: 'day',
          options: [
            {
              value: 'day',
              text: 'Day'
            },
            {
              value: 'Week',
              text: 'Week'
            },
            {
              value: 'month',
              text: 'Month'
            },
            {
              value: 'year',
              text: 'Year'
            },
            {
              value: 'allTime',
              text: 'All time'
            }
          ]
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
          // imageTextClass: '',
          // imageTitleTag: 'h6',
          // content: [
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          //   {
          //     img: 'https://24tv.ua/resources/photos/news/610x344_DIR/201812/1077000.jpg?201812161705',
          //     title: 'CS Global Offensive'
          //   },
          //   {
          //     img: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1543590720',
          //     title: 'Dota 2'
          //   },
          //   {
          //     img: 'https://versiya.info/uploads/posts/2018-11/1542721739_league-of-legends_0.jpg',
          //     title: 'League of legends'
          //   },
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          // ]
        },
        yourFilesStore: {
          sort: false,
          // imageTextClass: '',
          // imageTitleTag: 'h6',
          // content: [
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          //   {
          //     img: 'https://24tv.ua/resources/photos/news/610x344_DIR/201812/1077000.jpg?201812161705',
          //     title: 'CS Global Offensive'
          //   },
          //   {
          //     img: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1543590720',
          //     title: 'Dota 2'
          //   },
          //   {
          //     img: 'https://versiya.info/uploads/posts/2018-11/1542721739_league-of-legends_0.jpg',
          //     title: 'League of legends'
          //   },
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          // ]
        },
        recentlyPlayedStore: {
          sort: false,
          // imageTextClass: 'text-recently-played',
          // imageTitleTag: 'h6',
          // content: [
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2',
          //     text: '7 hours'
          //   },
          //   {
          //     img: 'https://24tv.ua/resources/photos/news/610x344_DIR/201812/1077000.jpg?201812161705',
          //     title: 'CS Global Offensive',
          //     text: '24 hours'
          //   },
          //   {
          //     img: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1543590720',
          //     title: 'Dota 2',
          //     text: '14 hours'
          //   },
          //   {
          //     img: 'https://versiya.info/uploads/posts/2018-11/1542721739_league-of-legends_0.jpg',
          //     title: 'League of legends',
          //     text: '2 hours'
          //   },
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2',
          //     text: '58 hours'
          //   },
          // ]
        },
        yourRecommendationStore: {
          sort: false,
          // imageTextClass: '',
          // imageTitleTag: 'h6',
          // content: [
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          //   {
          //     img: 'https://24tv.ua/resources/photos/news/610x344_DIR/201812/1077000.jpg?201812161705',
          //     title: 'CS Global Offensive'
          //   },
          //   {
          //     img: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1543590720',
          //     title: 'Dota 2'
          //   },
          //   {
          //     img: 'https://versiya.info/uploads/posts/2018-11/1542721739_league-of-legends_0.jpg',
          //     title: 'League of legends'
          //   },
          //   {
          //     img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
          //     title: 'Watch dogs 2'
          //   },
          // ]
        },
        user: {
          username: 'Username',
          country: 'Spain',
          category: 'Category',
          bio: '<p>A star is type of astronomical object consisting of a luminous spheroid of plasma held together by its own gravity.</p>' +
            '<p>The nearest star to Earth is the Sun. Many other stars are risible to the naked eye from Earth during the night, appearing' +
            'as a multitude of fixed luminous points in the sky due to their immense distance from Earth. Historically, the most prominent ' +
            'stars were grouped into constellations and asterisms, the brightest of which gained proper names.' +
            '<p>Astronomers have assembled star catalogues that identify the known stars and provide standardized stellar designations.</p>',
          photo: ''
        }
      };
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
    background: url(https://i.imgpile.com/nInalx.jpg);
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
