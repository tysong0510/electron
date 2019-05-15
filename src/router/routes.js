import DashboardLayout from "../layout/DashboardLayout.vue";

const Store = () => import(/* webpackChunkName: 'store' */ "@/pages/Store.vue");
const GameDetails = () => import(/* webpackChunkName: 'game-details' */ "@/pages/GameDetails.vue");
const Games = () => import(/* webpackChunkName: 'games' */ "@/pages/Games.vue");
const Profile = () => import(/* webpackChunkName: 'profile' */ "@/pages/Profile.vue");
const News = () => import(/* webpackChunkName: 'news' */ "@/pages/News.vue");
const NewsDetails = () => import(/* webpackChunkName: 'newsDetails' */ "@/pages/NewsDetails.vue");
const ProfileViewAll = () => import(/* webpackChunkName: 'profileViewAll' */ "@/pages/ProfileViewAll.vue");
const ApiDemo = () => import(/* webpackChunkName: 'apiDemo' */ "@/pages/ApiDemo");

const routes = [
  {
    // base: process.env.BASE_URL,
    path: "/",
    name: "home",
    component: DashboardLayout,
    redirect: "/store",
    children: [
      {
        path: "login",
        name: "login",
        redirect: {
          name: "store-top",
          query: { auth: "select" }
        }
      },
      {
        path: "store",
        name: "store",
        redirect: "/store/top",
        component: Store
      },
      {
        path: "games/:id(\\d+)",
        name: "my-game-details",
        component: GameDetails
        // meta: { requireAuth },
      },
      {
        path: "store/:id(\\d+)",
        name: "game-details",
        component: GameDetails
      },
      {
        path: "store/top",
        name: "store-top",
        component: Store
      },
      {
        path: "store/featured",
        name: "store-featured",
        component: Store
      },
      {
        path: "store/all",
        name: "store-all",
        component: Store
      },
      {
        path: "games",
        name: "games",
        component: Games,
        meta: { auth: true }
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
        meta: { auth: true }
      },
      {
        path: "profile/top-games",
        name: "my-top-games",
        component: ProfileViewAll
        // meta: { requireAuth }
      },
      {
        path: "profile/files",
        name: "my-files",
        component: ProfileViewAll
        // meta: { requireAuth }
      },
      {
        path: "profile/recommendation",
        name: "my-recommendation",
        component: ProfileViewAll
        // meta: { requireAuth }
      },
      {
        path: "profile/recently-played",
        name: "recently-played",
        component: ProfileViewAll
        // meta: { requireAuth }
      },
      {
        path: "news",
        name: "news",
        component: News
      },
      {
        path: "news/:id",
        name: "news-details",
        component: NewsDetails
      },
      {
        path: "api/demo",
        name: "api-demo",
        component: ApiDemo
      }
    ]
  }
];

export default routes;
