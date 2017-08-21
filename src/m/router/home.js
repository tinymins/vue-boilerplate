/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:33:07 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 12:34:19
 */

export default [
  {
    name: 'home',
    components: {
      tabbar: () => import('@m/components/tabbar.vue'),
      main: () => import('@m/components/main.vue'),
    },
    children: [
      {
        name: 'home_test',
        component: () => import('@m/views/home/test.vue'),
      },
    ],
  },
];

