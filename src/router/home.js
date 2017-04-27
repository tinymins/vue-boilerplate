/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-27 17:42:23
*/
/* eslint-disable global-require */
export default [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'home_test' },
    meta: { parent: 'home' },
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../components/main.vue'))),
    },
    children: [
      {
        name: 'home_test',
        path: 'test',
        component: resolve => require.ensure([], () => resolve(require('../views/home/test.vue'))),
      },
    ],
  },
];
