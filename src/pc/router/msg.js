/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:35 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 17:22:09
 */

export default [
  {
    name: 'msg',
    components: {
      header: () => import('@pc/components/header.vue'),
      main: () => import('@pc/components/main.vue'),
      footer: () => import('@pc/components/footer.vue'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@pc/views/msg/test.vue'),
      },
    ],
  },
];
