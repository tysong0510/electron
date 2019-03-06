<template>
  <div>
    <b-row>
      <template v-for="(game, index) in games">
        <b-col cols="6" :key="'game-' + index">
          <b-card no-body class="mb-2 mt-2 border-0 game"
                  @click="$router.push({name: 'my-game-details', params: {id: game.id}})" style="cursor: pointer;">
            <!-- class="overflow-hidden" style="max-width: 540px;" -->
            <!--<b-row no-gutters>-->
            <!--<b-col md="6">-->
            <!--</b-col>-->
            <!--<b-col md="6">-->
            <b-card-body>
              <b-row>
                <b-col cols="2" class="m-auto p-0">
                  <b-card-img :src="game.img" class="rounded-lg"/>
                </b-col>
                <b-col>
                  <b-card-title class="text-white font-weight-normal" title-tag="h6">{{ game.title }}</b-card-title>
                  <b-card-text>
                    <small class="text-muted">{{game.releaseDate}}</small>
                    <small class="text-muted d-block">{{game.size}}</small>
                  </b-card-text>
                </b-col>
              </b-row>
              <!--<div class="pt-3">-->
              <!--<b-button id="playButton" v-on:click="play(game.gameId)" variant="primary">Play</b-button>-->
              <!--&lt;!&ndash;<b-button id="deleteButton" v-on:click="deleteGame(game.gameId)" variant="light">Delete</b-button>&ndash;&gt;-->
              <!--</div>-->
              <!--<a v-on:click="settings">
                <img src="../assets/icons/settings.svg" />
              </a>-->
            </b-card-body>
            <!--</b-col>-->
            <!--</b-row>-->
          </b-card>
        </b-col>
        <b-col cols="12" :key="'line-' + (index / 2 >> 0)" v-if="index % 2">
          <b-row class="ml-1 mr-1">
            <b-col cols="12" class="border-bottom"></b-col>
          </b-row>
        </b-col>
      </template>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'Games',
    data() {
      return {
        yourGames: {
          games: [
            {
              img: 'https://www.techpowerup.com/reviews/Performance_Analysis/Watch_Dogs_2/images/small.png',
              title: 'Watch Dogs 2',
              releaseDate: '20 feb. 2019',
              gameId: '1',
              size: '4.2 GB'
            },
            {
              img: 'https://csgo-crosshair.com/assets/images/logo.jpg',
              title: 'CS Global Offencive',
              releaseDate: '20 feb. 2019',
              gameId: '2',
              size: '4.2 GB'
            },
            {
              img: 'http://imperators-soeckchen.de/wp-content/uploads/sites/145/2018/05/1.jpg',
              title: 'Dota 2',
              releaseDate: '20 feb. 2019',
              gameId: '3',
              size: '4.2 GB'
            },
            {
              img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi008MJfTaEatBHCt5nqagS4_vqi5W68fHi1dQSHR45tNmMJNh',
              title: 'League of Legends',
              releaseDate: '20 feb. 2019',
              gameId: '4',
              size: '4.2 GB'
            },
            {
              img: 'https://rusoz.ru/wp-content/uploads/2016/04/team_fortress_2.png',
              title: 'Team Fortress 2',
              releaseDate: '20 feb. 2019',
              gameId: '5',
              size: '4.2 GB'
            },
            {
              img: 'https://cdn141.picsart.com/258923433007202.png?c256x256',
              title: 'FIFA 19',
              releaseDate: '20 feb. 2019',
              gameId: '6',
              size: '4.2 GB'
            },
            {
              img: 'https://steamuserimages-a.akamaihd.net/ugc/388790936728994789/D50100C4F663819692DE1459636FD10FF93CC65D/',
              title: 'RUST',
              releaseDate: '20 feb. 2019',
              gameId: '7',
              size: '4.2 GB'
            },
            {
              img: 'https://warcraft3map.github.io/img/war3mapPreview12.png',
              title: 'Warcraft III',
              releaseDate: '20 feb. 2019',
              gameId: '8',
              size: '4.2 GB'
            }
          ]
        }
      }
    },
    methods: {
      play: (gameId) => {
        alert(`Running game with id ${gameId}`);
      },
      settings: (gameId) => {
        alert(`Settings for game with id ${gameId}`);
      },
      deleteGame: (gameId) => {
        alert(`Delete game with id ${gameId}`);
      }
    },
    computed: {
      games() {
        return this.$store.getters.games;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../assets/scss/partials/store";

  .game {
    transition: ease-in-out 0.25s;

    &:hover {
      background-color: $block-hover-background-color;
    }
  }

  /*.card-img {*/
  /*max-width: 100px;*/
  /*max-height: 100px;*/
  /*width: unset;*/
  /*}*/
  /*.col {*/
  /*padding-bottom: 3rem;*/
  /*margin-bottom: 3rem;*/
  /*}*/

  /*.card-title {*/
  /*max-width: 540px;*/
  /*border: none;*/
  /*margin-bottom: 1.5em;*/
  /*}*/

  /*h4.card-title {*/
  /*margin-bottom: 0.1em;*/
  /*}*/

  button {
    width: 92px;
    font-size: 12px;
    border-radius: 30px;
    /*margin-right: 10px;*/
    /*margin-left: 10px;*/
  }

  /*.card-img {*/
  /*width: 141px;*/
  /*height: 141px;*/
  /*}*/

  #playButton {
    background: #2B6DF9;
  }

  #deleteButton {
    background: #ffffff;
    color: #2b6df9;
    font-size: 12px;
  }

  #a {
    float: right;
  }
</style>
