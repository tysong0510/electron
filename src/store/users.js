import Vapi from 'vuex-rest-api';
import { baseURL } from '../apiConfig';

/**
 * Games store from api
 */
export default new Vapi({
  baseURL,
  state: {
    userFilesStatistic: [],
  },
})
  .get({
    action: 'getUserFilesStatistic',
    property: 'userFilesStatistic',
    path: '/users/games/statistic',
  })
  .getStore();
