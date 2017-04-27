/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:11
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-27 17:42:39
*/
/* eslint-disable global-require */
export default [
  {
    path: '/msg',
    name: 'msg',
    redirect: { name: 'msg_test' },
    meta: { parent: 'msg' },
    components: {
      tabbar: resolve => require.ensure([], () => resolve(require('../components/tabbar.vue'))),
      main: resolve => require.ensure([], () => resolve(require('../components/main.vue'))),
    },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        component: resolve => require.ensure([], () => resolve(require('../views/msg/test.vue'))),
      },
    ],
  },
];
