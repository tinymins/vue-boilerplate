/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:35:08 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 12:35:19
 */

export default [
  {
    name: 'home',
    components: {
      tabbar: () => import('@pc/components/tabbar.vue'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'home_test',
        component: () => import('@pc/views/home/test.vue'),
      },
    ],
  },
];

