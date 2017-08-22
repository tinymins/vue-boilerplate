/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 12:01:27 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 17:21:39
 */

export default [
  {
    name: 'debug',
    components: {
      header: () => import('@pc/components/header.vue'),
      main: () => import('@pc/components/main.vue'),
      footer: () => import('@pc/components/footer.vue'),
    },
    children: [
      {
        name: 'debug_index',
        component: () => import('@pc/views/debug/index.vue'),
      },
    ],
  },
];