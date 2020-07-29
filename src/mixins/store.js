import { mapActions, mapState } from "vuex";
import { baseURL } from "../apiConfig";

const sizeUnits = ["B", "KB", "MB", "GB", "TB"];

export default {
  filters: {
    memorySize(val) {
      const parsedVal = Number.parseFloat(val);
      let iteration = 0;

      let resultVal = parsedVal;

      while (resultVal > 1024 && iteration + 1 < sizeUnits.length) {
        resultVal = resultVal / 1024;
        iteration += 1;
      }

      if (Number.isNaN(resultVal)) {
        resultVal = 0;
      }

      return `${resultVal.toFixed(1)} ${sizeUnits[iteration]}`;
    }
  },
  computed: {
    /**
     * Get current store name (route name)
     *
     * @return {string}
     */
    currentStore() {
      return this.$router.currentRoute.name;
    },
    ...mapState({
      games: state => state.games,
      userGames: state => state.userGames,
      featuredGames: state => state.featuredGames,
      topGames: state => state.topGames,
      comingSoon: state => state.comingSoon,
      pending: state => state.pending,
      error: state => state.error
    })
  },
  watch: {
    "pending.games": function() {
      if (!this.pending.games) {
        this.getData(this.currentStore);
      }
    }
  },
  methods: {
    ...mapActions(["getGames", "getFeatured", "getTopGames", "getUserGames", "getComingSoon"]),
    /**
     * Sort store by options
     *
     * @param {Object} store
     * @param options?
     * @return void
     */
    storeSort(store, options = {}) {
      let { byField, order, sort } = options;

      /**
       * Sort store by default
       * Disabling sort if sort is false, or store.sort is false
       */
      if (!sort) {
        if (sort === undefined) {
          if (store.hasOwnProperty("sort")) {
            if (!(store.sort === undefined || store.sort)) {
              return;
            }
          }
        } else {
          return;
        }
      }

      if (!byField) {
        if (store.hasOwnProperty("byField") && store.byField) {
          byField = store.byField;
        } else {
          byField = "rating";
        }
      }

      if (!order) {
        order = store.order || "DESC";
      }

      let orderVector = 0;

      switch (order) {
        case "ASC":
          orderVector = 1;
          break;
        case "DESC":
        default:
          orderVector = -1;
      }

      if (store && store.content && !Array.isArray(store.content)) {
        for (const key in store.content) {
          if (store.content.hasOwnProperty(key)) {
            if (Array.isArray(store.content[key])) {
              store.content[key].sort((a, b) => (a[byField] - b[byField]) * orderVector);
            }
          }
        }
      } else {
        store.content.sort((a, b) => (a[byField] - b[byField]) * orderVector);
      }
    },
    getImagePath(game, type = "main") {
      if (game.images) {
        switch (type) {
          case "main":
            //console.log("what is this: " + game.images.main);
            //return game.images.main ? `${baseURL}/apps/${game.id}/${game.images.main}` : null;
            return game.images.main;
          case "slides":
            if (game.images.slides || game.images.images) {
              const slides = [];

              for (const slide of game.images.slides || game.images.images) {
                slides.push(`${baseURL}/apps/${game.id}/${slide}`);
                //console.log("array: "+ game.images.slides.slide);
              }

              return slides;
            }
            return null;
        }
      } else {
        return null;
      }
    }
  }
};
