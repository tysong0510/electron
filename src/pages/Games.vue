<template>
  <div>
    <b-row>
      <b-col v-if="pending.userGames">
        Loading...
      </b-col>
      <b-col v-else-if="!userGames">
        No games :(
      </b-col>
      <template v-for="(game, index) in userGames" v-else>
        <b-col :key="'game-' + index" cols="6">
          <b-card
            no-body
            class="mb-2 mt-2 border-0 game"
            tag="a"
            :href="$router.resolve({ name: 'my-game-details', params: { id: game.id } }).href"
          >
            <!-- class="overflow-hidden" style="max-width: 540px;" -->
            <!--<b-row no-gutters>-->
            <!--<b-col md="6">-->
            <!--</b-col>-->
            <!--<b-col md="6">-->
            <b-card-body>
              <b-row>
                <b-col cols="3" class="m-auto text-center">
                  <b-card-img :src="getImagePath(game)" class="rounded-lg" />
                </b-col>
                <b-col>
                  <b-card-title class="text-white font-weight-normal" title-tag="h6">
                    {{ game.title }}
                  </b-card-title>
                  <b-card-text>
                    <small class="text-muted">{{ game.releaseDate | dateFormat }}</small>
                    <small class="text-muted d-block">{{ game.sizeBytes | memorySize }}</small>
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
        <b-col v-if="index % 2" :key="'line-' + ((index / 2) >> 0)" cols="12">
          <b-row class="ml-1 mr-1">
            <b-col cols="12" class="border-bottom" />
          </b-row>
        </b-col>
      </template>
    </b-row>
  </div>
</template>

<script>
import store from "../mixins/store";
import date from "../mixins/date";
import user from "../mixins/user";

export default {
  name: "Games",
  mixins: [store, date, user],
  data() {
    return {};
  },
  computed: {},
  created() {
    this.getUserGames();
  },
  methods: {
    getData() {},
    play: gameId => {
      alert(`Running game with id ${gameId}`);
    },
    settings: gameId => {
      alert(`Settings for game with id ${gameId}`);
    },
    deleteGame: gameId => {
      alert(`Delete game with id ${gameId}`);
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

  &:hover {
    background-color: $block-hover-background-color;
  }

  img {
    max-height: 75px;
    max-width: 120px;
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
  background: #2b6df9;
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
