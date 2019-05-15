export default {
  filters: {
    /**
     * Format number or number string to price string
     * @param {string|number} value
     * @param currency
     * @param locales
     * @return {string}
     */
    currency(value, currency = "USD", locales = "en-US") {
      /**
       * Convert value to float
       * @type {number}
       */
      value = Number.parseFloat(value);

      /**
       * If price value invalid than return free
       * @type {string}
       */
      const defaultPrice = "FREE";

      /**
       * Parse not valid price
       */
      if (Number.isNaN(value) || value <= 0) {
        return defaultPrice;
      }

      /**
       * @type {Intl.NumberFormat}
       */
      const formatter = Intl.NumberFormat(locales, { style: "currency", currency });

      return formatter.format(value);
    }
  }
};
