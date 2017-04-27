/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:19
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-27 17:42:35
*/
/* eslint-disable global-require */
export default [
  {
    path: '/me',
    name: 'me',
    redirect: { name: 'me_test' },
    meta: { parent: 'me' },
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../components/main.vue'))),
    },
    children: [
      {
        name: 'me_test',
        path: 'test',
        component: resolve => require.ensure([], () => resolve(require('../views/me/test.vue'))),
      },
    ],
  },
];
