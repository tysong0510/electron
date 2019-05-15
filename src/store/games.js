import Vapi from "vuex-rest-api";
import { baseURL } from "../apiConfig";

/**
 * Games store from api
 */
export default new Vapi({
  baseURL,
  state: {
    games: [],
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
  .getStore();
