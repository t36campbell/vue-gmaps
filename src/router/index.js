import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Stores from '../views/Stores.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/search/:tag',
    name: 'Home',
    component: Home,
    props: true,
  },
  {
    path: '/stores',
    name: 'Stores',
    component: Stores,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
