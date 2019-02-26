import DashboardLayout from '../layout/DashboardLayout.vue';

const Store = () => import(/* webpackChunkName: 'store' */'@/pages/Store.vue');
const Profile = () => import(/* webpackChunkName: 'common' */'@/pages/Profile.vue');

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
        component: Store,
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
    ],
  },
];

export default routes;
