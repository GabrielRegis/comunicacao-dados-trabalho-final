import Vue from 'vue';
import Router from 'vue-router';
import Nrz from './components/nrz.vue';
import Rz from './components/rz.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/nrz',
      name: 'nrz',
      component: Nrz,
    },
    {
      path: '/rz',
      name: 'rz',
      component: Rz,
    },
  ],
});