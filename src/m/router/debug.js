/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 10:57:10 am
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 16:04:30
 */

export default [
  {
    name: 'debug',
    components: {
      main: () => import('@m/components/main.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'debug_index',
        component: () => import('@m/views/debug/index.vue'),
      },
    ],
  },
];
