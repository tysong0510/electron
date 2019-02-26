import DashboardLayout from '../layout/DashboardLayout.vue';

const Store = () => import(/* webpackChunkName: 'store' */'@/pages/Store.vue');
const Games = () => import(/* webpackChunkName: 'games' */'@/pages/Games.vue');
const Profile = () => import(/* webpackChunkName: 'profile' */'@/pages/Profile.vue');
const News = () => import(/* webpackChunkName: 'news' */'@/pages/News.vue');

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
      }
    ]
  }
];

export default routes;
