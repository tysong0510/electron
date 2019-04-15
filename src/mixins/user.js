import { mapGetters } from 'vuex';
import { IS_LOGGED_IN, USER } from '../store/modules/auth';

export default {
  computed: {
    ...mapGetters([
      USER,
      IS_LOGGED_IN,
    ]),
  },
};
