import DashboardLayout from '../layout/DashboardLayout.vue';

const Store = () => import(/* webpackChunkName: 'store' */'@/pages/Store.vue');
const GameDetails = () => import(/* webpackChunkName: 'game-details' */'@/pages/GameDetails.vue');
const Games = () => import(/* webpackChunkName: 'games' */'@/pages/Games.vue');
const Profile = () => import(/* webpackChunkName: 'profile' */'@/pages/Profile.vue');
const News = () => import(/* webpackChunkName: 'news' */'@/pages/News.vue');
const NewsDetails = () => import(/* webpackChunkName: 'newsDetails' */'@/pages/NewsDetails.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardLayout,
    redirect: '/store',
    children: [
      {
        path: 'store',
        name: 'store',
        redirect: '/store/top',
        component: Store
      },
      {
        path: 'games/:id(\\d+)',
        name: 'my-game-details',
        component: GameDetails
      },
      {
        path: 'store/:id(\\d+)',
        name: 'game-details',
        component: GameDetails
      },
      {
        path: 'store/top',
        name: 'store-top',
        component: Store
      },
      {
        path: 'store/featured',
        name: 'store-featured',
        component: Store
      },
      {
        path: 'games',
        name: 'games',
        component: Games
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: 'news',
        name: 'news',
        component: News
      },
      {
        path: 'news/details',
        name: 'newsDetails',
        component: NewsDetails
      }
    ]
  }
];

export default routes;
