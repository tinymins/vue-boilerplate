/*
* @Author: William
* @Date:   2017-04-27 15:49:02
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-27 17:42:53
*/
/* eslint-disable global-require */
export default [
  {
    path: '/',
    redirect: { name: 'index' },
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../components/main.vue'))),
    },
    children: [
      {
        name: 'index',
        path: '',
        component: resolve => require.ensure([], () => resolve(require('../views/index.vue'))),
      },
    ],
  },
  {
    path: '*',
    name: '404',
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../views/404.vue'))),
    },
  },
];
