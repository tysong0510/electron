<template>
  <div>
    <ul>
      <li v-for="(game, index) in games" :key="index" @click="gameShow(game)">{{game}}</li>
    </ul>
    <p v-if="pending.games">loading posts...</p>
    <p v-if="error.games">loading failed</p>

    <b-modal :title="modalTitle" v-model="modalShow" v-if="game || error.game">
      {{ game || error.game }}
    </b-modal>
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";

  export default {
    name: "ApiDemo",
    data() {
      return {
        modalShow: false,
        modalContent: null
      }
    },
    computed: {
      ...mapState({
        games: state => state.games,
        game: state => state.game,
        pending: state => state.pending,
        error: state => state.error,
      }),
      modalTitle: {
        get() {
          return this.game ? this.game.title : 'Modal';
        }
      }
    },
    methods: {
      ...mapActions([
        "getGame",
        "getGames"
      ]),
      gameShow(game) {
        this.getGame({params: game}).then(
          () => this.modalShow = true,
          () => this.modalShow = true
        );
      }
    },
    created() {
      this.getGames();
    }
  }
</script>

<style scoped>

</style>
