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
          path: 'highGeo',
          name: 'highGeo',
          component: () => import(/* webpackChunkName: "highGeo" */ './views/chapter2/highGeo'),
        },
        {
          path: 'binaryOperation',
          name: 'binaryOperation',
          component: () => import(/* webpackChunkName: "binaryOperation" */ './views/chapter2/binaryOperation'),
        },
        {
          path: 'sprite',
          name: 'sprite',
          component: () => import(/* webpackChunkName: "sprite" */ './views/chapter2/sprite'),
        },
        {
          path: 'loadObj',
          name: 'loadObj',
          component: () => import(/* webpackChunkName: "loadObj" */ './views/chapter2/loadObj'),
        },
        {
          path: 'animation',
          name: 'animation',
          component: () => import(/* webpackChunkName: "animation" */ './views/chapter2/animation'),
        },
        {
          path: 'texture',
          name: 'texture',
          component: () => import(/* webpackChunkName: "texture" */ './views/chapter2/texture'),
        },
        {
          path: 'physic',
          name: 'physic',
          component: () => import(/* webpackChunkName: "physic" */ './views/chapter2/physic'),
        },
        {
          path: 'audio',
          name: 'audio',
          component: () => import(/* webpackChunkName: "audio" */ './views/chapter2/audio'),
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
