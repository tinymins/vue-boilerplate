/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:01:27 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 12:58:01
 */

export default [
  {
    name: 'debug',
    components: {
      tabbar: () => import('@pc/components/tabbar.vue'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'debug_index',
        component: () => import('@pc/views/debug/index.vue'),
      },
    ],
  },
];
