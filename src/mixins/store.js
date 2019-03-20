export default {
  computed: {
    /**
     * Get current store name (route name)
     *
     * @return {string}
     */
    currentStore() {
      return this.$router.currentRoute.name;
    },
  },
  methods: {
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
          if (store.hasOwnProperty('sort')) {
            if (!(store.sort === undefined || store.sort)) {
              return;
            }
          }
        } else {
          return;
        }
      }

      if (!byField) {
        if (store.hasOwnProperty('byField') && store.byField) {
          byField = store.byField;
        } else {
          byField = 'rating';
        }
      }

      if (!order) {
        order = store.order || 'DESC';
      }

      let orderVector = 0;

      switch (order) {
        case 'ASC':
          orderVector = 1;
          break;
        case 'DESC':
        default:
          orderVector = -1;
      }

      if (store && store.content && !Array.isArray(store.content)) {
        for (const key in store.content) {
          if (store.content.hasOwnProperty(key)) {
            if (Array.isArray(store.content[key])) {
              store.content[key].sort((a, b) => (a[byField] - b[byField]) * (orderVector));
            }
          }
        }
      } else {
        store.content.sort((a, b) => (a[byField] - b[byField]) * (orderVector));
      }
    },
  },
};
