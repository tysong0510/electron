import Vapi from "vuex-rest-api";
import { baseURL } from "../apiConfig";

/**
 * Games store from api
 */
export default new Vapi({
  baseURL,
  state: {
    games: [],
    startedGame: {},
    game: null
  }
})
  .get({
    action: "getGames",
    property: "games",
    path: "/games"
  })
  .get({
    action: "getGame",
    property: "game",
    path: ({ id }) => `/games/${id}`
  })
  .post({
    action: "buyGame",
    property: "buyGame",
    path: ({ id }) => `/users/games/buy-by-game-id/${id}`
  })
  .post({
    action: "getGameStatus",
    property: "gameStatus",
    path: ({ id }) => `/users/games/find-by-game-id/${id}`
  })
  .get({
    action: "getFeatured",
    property: "featuredGames",
    path: "/games/filter/featured"
  })
  .get({
    action: "getTopGames",
    property: "topGames",
    path: "/games/filter/top"
  })
  .get({
    action: "getComingSoon",
    property: "comingSoon",
    path: "/games/filter/comingSoon"
  })
  .getStore();
