/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:01:01 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 17:48:23
 */

export default [
  {
    name: 'me',
    components: {
      main: () => import('@m/components/main.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'me_test',
        component: () => import('@m/views/me/test.vue'),
      },
    ],
  },
];
