/*
* @Author: William
* @Date:   2017-04-27 15:49:02
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:56:31
*/

export default [
  {
    components: {
      main: () => import('@m/components/main.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'index',
        component: () => import('@m/views/index.vue'),
      },
    ],
  },
  {
    name: '404',
    components: {
      main: () => import('@m/views/404.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
  },
];
