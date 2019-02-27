<template>
  <div>
    <b-container>
      <b-row>
        <b-col v-for="(game, index) in yourGames.games" cols="6" :key="index">
          <b-card no-body style="max-width: 540px; border: none; margin-bottom: 1.5em;">
            <b-row no-gutters>
              <b-col cols="4">
                <b-card-img :src="game.img" class="rounded-0" style="width: 141px; height: 141px;" />
              </b-col>
              <b-col>
                <b-card-body :title="game.title">
                  <a v-on:click="settings" style="display: inline-block; float: right;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Wikipedia_interwiki_section_gear_icon.svg/1024px-Wikipedia_interwiki_section_gear_icon.svg.png" alt="img" style="width: 24px; height: 24px">
                  </a>
                  <h3 style="font-size: 14px;">{{game.releaseDate}}</h3>
                  <b-button v-on:click.prevent="play(game.gameId)" variant="primary" style="width: 92px;background: #2B6DF9;border-radius: 30px;">Play</b-button>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
              img: "https://www.techpowerup.com/reviews/Performance_Analysis/Watch_Dogs_2/images/small.png",
              title: "Watch Dogs 2",
              releaseDate: "20 feb. 2019",
              gameId: "1"
            },
            {
              img: "https://csgo-crosshair.com/assets/images/logo.jpg",
              title: "CS Global Offencive",
              releaseDate: "20 feb. 2019",
              gameId: "2"
            },
            {
              img: "http://imperators-soeckchen.de/wp-content/uploads/sites/145/2018/05/1.jpg",
              title: "Dota 2",
              releaseDate: "20 feb. 2019",
              gameId: "3"
            },
            {
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi008MJfTaEatBHCt5nqagS4_vqi5W68fHi1dQSHR45tNmMJNh",
              title: "League of Legends",
              releaseDate: "20 feb. 2019",
              gameId: "4"
            },
            {
              img: "https://rusoz.ru/wp-content/uploads/2016/04/team_fortress_2.png",
              title: "Team Fortress 2",
              releaseDate: "20 feb. 2019",
              gameId: "5"
            },
            {
              img: "https://cdn141.picsart.com/258923433007202.png?c256x256",
              title: "FIFA 19",
              releaseDate: "20 feb. 2019",
              gameId: "6"
            },
            {
              img: "https://steamuserimages-a.akamaihd.net/ugc/388790936728994789/D50100C4F663819692DE1459636FD10FF93CC65D/",
              title: "RUST",
              releaseDate: "20 feb. 2019",
              gameId: "7"
            },
            {
              img: "https://warcraft3map.github.io/img/war3mapPreview12.png",
              title: "Warcraft III",
              releaseDate: "20 feb. 2019",
              gameId: "8"
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
      }
    }
  }
</script>
