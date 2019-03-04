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
                  <b-card-title title-tag="h1" class="game-title">{{ game.title }}</b-card-title>
                  <b-card-sub-title sub-title-tag="h6" sub-title-text-variant="white">{{ game.category }}
                  </b-card-sub-title>
                </b-col>
                <b-col cols="5">
                  <b-button variant="primary" size="lg" @click="gameBuy()" class="btn-buy">{{ game.price }}</b-button>
                </b-col>
              </b-row>
              <b-row ref="hLine">
                <b-col>
                  <b-col cols="12" class="h-line"></b-col>
                </b-col>
              </b-row>
              <b-row class="rating">
                <b-col class="pr-0 m-auto d-inline-flex align-middle">
                  <span class="mr-3">{{ game.vote }}</span>
                  <vote-bar :vote="game.vote" style="font-size: 0.8em;"></vote-bar>
                </b-col>
              </b-row>
              <b-row class="mt-3" size="sm">
                <b-col>
                  <b-button variant="outline-secondary" class="btn-voted">Voted</b-button>
                </b-col>
              </b-row>
              <!--<b-row v-html="$refs.hLine.innerHTML"></b-row>-->
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
      <b-row class="mb-4 mt-4">
        <b-col>
          <carousel v-bind="carouselOptions" v-if="game.slides.length > 0">
            <slide v-for="(image, index) in game.slides" :key="index" class="mr-1 ml-1">
              <b-card :img-src="image" class="no-border"></b-card>
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
      description(text) {
        return text.replace(new RegExp('\\n', 'g'), '<br>');
      },
      gameBuy() {
        confirm(`Confirm buy game with id ${this.game.id} for ${this.game.price}?`);
      },
      fetchData() {
        this.error = null;
        this.game = null;
        this.loading = true;

        let gameId = this.$route.params.id;

        setTimeout(() => {
          this.loading = false;

          let testData = {
            '1': {
              id: '1',
              title: 'Watch Dogs 2',
              img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
              price: '$ 49.99',
              category: 'Stealth',
              vote: '4.7',
              description: 'Watch Dogs 2 (stylized as WATCH_DOGS 2) is an action- adventure video game developed by Ubisoft Montreal and published by Ubisoft. \n' +
                '\n' +
                'It is the sequel to 2014\'s Watch Dogs and was released worldwide for PlayStation 4, Xbox One and Microsoft Windows in November 2016. \n' +
                '\n' +
                'Set within a fictionalized version of the San Francisco Bay Area, the game is played from a third- person perspective and its open world is navigated on-foot or by vehicle. Players control Marcus Holloway, a hacker who works with the hacking group DedSec to take down the city\'s advanced surveillance system known as ctoS. \n' +
                '\n' +
                'There are multiple ways to complete missions, and each successful assignment increases the follower count of DedSec. Cooperative multiplayer allows for competitive one-on-one combat and connecting with other players in order to neutralize a player who is causing havoc. \n' +
                '\n' +
                'Ubisoft Montreal, the game\'s developer, studied player feedback from the first game \n' +
                'to assess what could be improved in Watch Dogs 2 and the setting was researched \n' +
                'by making frequent trips Ubisoft Reflections was responsible for overhauling the driving mechanic. \n' +
                '\n' +
                'Real hackers were consulted to validate scripts and game mechanics for authenticity and references to real life hacktivism were fictionalized, like the Project Chanology protest. \n' +
                '\n' +
                'The original soundtrack for Watch Dogs 2 was composed by Hudson Mohawke. \n' +
                '\n' +
                'The game was released to overall reception from critics which praised the game for improving upon the original Watch Dogs in areas like the hacking, setting, characters and driving. \n' +
                '\n' +
                'However, character inconsistencies firearms and frequent technical issues - later patched - were cited as imperfections.',
              slides: [
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
              ]
            },
            '2': {
              id: '2',
              title: 'Watch Dogs 3',
              img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
              price: '$ 59.99',
              category: 'Stealth',
              vote: '4.5',
              description: 'Watch Dogs 2 (stylized as WATCH_DOGS 2) is an action- adventure video game developed by Ubisoft Montreal and published by Ubisoft. \n' +
                '\n' +
                'It is the sequel to 2014\'s Watch Dogs and was released worldwide for PlayStation 4, Xbox One and Microsoft Windows in November 2016. \n' +
                '\n' +
                'Set within a fictionalized version of the San Francisco Bay Area, the game is played from a third- person perspective and its open world is navigated on-foot or by vehicle. Players control Marcus Holloway, a hacker who works with the hacking group DedSec to take down the city\'s advanced surveillance system known as ctoS. \n' +
                '\n' +
                'There are multiple ways to complete missions, and each successful assignment increases the follower count of DedSec. Cooperative multiplayer allows for competitive one-on-one combat and connecting with other players in order to neutralize a player who is causing havoc. \n' +
                '\n' +
                'Ubisoft Montreal, the game\'s developer, studied player feedback from the first game \n' +
                'to assess what could be improved in Watch Dogs 2 and the setting was researched \n' +
                'by making frequent trips Ubisoft Reflections was responsible for overhauling the driving mechanic. \n' +
                '\n' +
                'Real hackers were consulted to validate scripts and game mechanics for authenticity and references to real life hacktivism were fictionalized, like the Project Chanology protest. \n' +
                '\n' +
                'The original soundtrack for Watch Dogs 2 was composed by Hudson Mohawke. \n' +
                '\n' +
                'The game was released to overall reception from critics which praised the game for improving upon the original Watch Dogs in areas like the hacking, setting, characters and driving. \n' +
                '\n' +
                'However, character inconsistencies firearms and frequent technical issues - later patched - were cited as imperfections.',
              slides: [
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
                'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
              ]
            }
          };

          if (testData[gameId]) {
            this.game = testData[gameId];
          } else {
            this.error = `Game with id ${gameId} not found`;
          }
        }, 500);
      }
    }
  }
</script>

<style scoped lang="scss">
  .game-details {
    color: white;

    .card-body {
      padding-top: 0;
      padding-bottom: 0;
      color: white;

      .game-title {
        font-weight: bold;
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
      font-size: 1.4em;
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
