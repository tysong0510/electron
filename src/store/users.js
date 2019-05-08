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
    path: '/users/games/stats',
  })
  .get({
    action: 'fixStatistics',
    path: '/statistics/fix'
  })
  .get({
    action: 'getGamesStatistics',
    property: 'gamesStatistics',
    path: '/user-game-statistics/last',
  })
  .get({
    action: 'getUserGames',
    property: 'userGames',
    path: '/users/games',
  })
  .getStore();
