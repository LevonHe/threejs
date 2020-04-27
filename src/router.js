import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/layout/layout';
import PageNotFound from './views/pageNotFound/pageNotFound';
import Experience from './views/chapter1/experience';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'experience' },
      component: Layout,
      children: [
        {
          path: 'experience',
          name: 'experience',
          component: Experience,
        },
        {
          path: 'light',
          name: 'light',
          component: () => import(/* webpackChunkName: "light" */ './views/chapter1/light'),
        },
        {
          path: 'material',
          name: 'material',
          component: () => import(/* webpackChunkName: "material" */ './views/chapter1/material'),
        },
        {
          path: 'geometry',
          name: 'geometry',
          component: () => import(/* webpackChunkName: "geometry" */ './views/chapter1/geometry'),
        },
        {
          path: 'chapter2',
          name: 'chapter2',
          component: () => import(/* webpackChunkName: "chapter2" */ './views/chapter2'),
        },
        {
          path: 'chapter3',
          name: 'chapter3',
          component: () => import(/* webpackChunkName: "chapter3" */ './views/chapter3'),
        },
      ],
    },
    {
      path: '*',
      name: '404',
      component: PageNotFound,
    },
  ],
});

export default router;
