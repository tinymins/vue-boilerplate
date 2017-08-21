/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:33:07 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 16:04:27
 */

export default [
  {
    name: 'home',
    components: {
      main: () => import('@m/components/main.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'home_test',
        component: () => import('@m/views/home/test.vue'),
      },
    ],
  },
];

