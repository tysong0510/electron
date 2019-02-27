<template>
  <div>
    <b-card-group columns>
      <b-card no-body v-for="(game, index) in yourGames.games" :key="index" class="pb-5 mb-5"><!-- class="overflow-hidden" style="max-width: 540px;" -->
        <b-row no-gutters>
          <b-col md="6">
            <b-card-img :src="game.img" class="rounded-lg" />
          </b-col>
          <b-col md="6">
            <b-card-body :title="game.title" class="text-white">
              <small class="text-muted">{{game.releaseDate}}</small>
              <div class="pt-3">
                <b-button id="playButton" v-on:click="play(game.gameId)" variant="primary">Play</b-button>
              <!--<b-button id="deleteButton" v-on:click="deleteGame(game.gameId)" variant="light">Delete</b-button>-->
              </div>
              <!--<a v-on:click="settings">
                <img src="../assets/icons/settings.svg" />
              </a>-->
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-card-group>
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
              gameId: '1'
            },
            {
              img: 'https://csgo-crosshair.com/assets/images/logo.jpg',
              title: 'CS Global Offencive',
              releaseDate: '20 feb. 2019',
              gameId: '2'
            },
            {
              img: 'http://imperators-soeckchen.de/wp-content/uploads/sites/145/2018/05/1.jpg',
              title: 'Dota 2',
              releaseDate: '20 feb. 2019',
              gameId: '3'
            },
            {
              img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi008MJfTaEatBHCt5nqagS4_vqi5W68fHi1dQSHR45tNmMJNh',
              title: 'League of Legends',
              releaseDate: '20 feb. 2019',
              gameId: '4'
            },
            {
              img: 'https://rusoz.ru/wp-content/uploads/2016/04/team_fortress_2.png',
              title: 'Team Fortress 2',
              releaseDate: '20 feb. 2019',
              gameId: '5'
            },
            {
              img: 'https://cdn141.picsart.com/258923433007202.png?c256x256',
              title: 'FIFA 19',
              releaseDate: '20 feb. 2019',
              gameId: '6'
            },
            {
              img: 'https://steamuserimages-a.akamaihd.net/ugc/388790936728994789/D50100C4F663819692DE1459636FD10FF93CC65D/',
              title: 'RUST',
              releaseDate: '20 feb. 2019',
              gameId: '7'
            },
            {
              img: 'https://warcraft3map.github.io/img/war3mapPreview12.png',
              title: 'Warcraft III',
              releaseDate: '20 feb. 2019',
              gameId: '8'
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .col {
    padding-bottom: 3rem;
    margin-bottom: 3rem;
  }

  .card-title {
    max-width: 540px;
    border: none;
    margin-bottom: 1.5em;
  }

  h4.card-title {
    margin-bottom: 0.1em;
  }

  button {
    width: 92px;
    font-size: 12px;
    border-radius: 30px;
    /*margin-right: 10px;*/
    /*margin-left: 10px;*/
  }

  .card-img {
    width: 141px;
    height: 141px;
  }

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
