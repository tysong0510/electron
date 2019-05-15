<template>
  <div>
    <ul>
      <li v-for="(game, index) in games" :key="index" @click="gameShow(game)">
        {{ game }}
      </li>
    </ul>
    <p v-if="pending.games">
      loading posts...
    </p>
    <p v-if="error.games">
      loading failed
    </p>

    <b-modal v-if="game || error.game" v-model="modalShow" :title="modalTitle">
      {{ game || error.game }}
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import user from "../mixins/user";

export default {
  name: "ApiDemo",
  mixins: [user],
  data() {
    return {
      modalShow: false
    };
  },
  computed: {
    ...mapState({
      games: state => state.games,
      game: state => state.game,
      pending: state => state.pending,
      error: state => state.error
    }),
    modalTitle: {
      get() {
        return this.game ? this.game.title : "Modal";
      }
    }
  },
  created() {
    this.getGames();
  },
  methods: {
    ...mapActions(["getGame", "getGames"]),
    gameShow(game) {
      this.getGame({ params: game }).then(
        () => {
          this.modalShow = true;
        },
        () => {
          this.modalShow = true;
        }
      );
    }
  }
};
</script>

<style scoped></style>
