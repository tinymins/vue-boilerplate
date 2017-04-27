/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:15
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-27 17:42:44
*/
/* eslint-disable global-require */
export default [
  {
    path: '/secret',
    name: 'secret',
    redirect: { name: 'secret_test' },
    meta: { parent: 'secret' },
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../components/main.vue'))),
    },
    children: [
      {
        name: 'secret_test',
        path: 'test',
        component: resolve => require.ensure([], () => resolve(require('../views/secret/test.vue'))),
      },
    ],
  },
];
