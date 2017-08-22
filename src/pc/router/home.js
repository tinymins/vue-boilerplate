/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:35:08 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 17:21:50
 */

export default [
  {
    name: 'home',
    components: {
      header: () => import('@pc/components/header.vue'),
      main: () => import('@pc/components/main.vue'),
      footer: () => import('@pc/components/footer.vue'),
    },
    children: [
      {
        name: 'home_test',
        component: () => import('@pc/views/home/test.vue'),
      },
    ],
  },
];
