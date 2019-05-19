import Vapi from "vuex-rest-api";
import { baseURL } from "../apiConfig";
import { LOAD_NEWS, LOAD_NEWS_ITEM } from "./actions-types";

/**
 * News store from api
 */
export default new Vapi({
  baseURL,
  state: {
    news: [],
    newsItem: null
  }
})
  .get({
    action: LOAD_NEWS,
    property: "news",
    path: "/news"
  })
  .get({
    action: LOAD_NEWS_ITEM,
    property: "newsItem",
    path: ({ id }) => `/news/${id}`
  })
  .getStore();
