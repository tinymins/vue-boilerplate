/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:35 pm
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 10:40:53
 */

export default [
  {
    name: 'msg',
    components: {
      header: () => import('@/pc/components/header.vue'),
      main: () => import('@/pc/components/main.vue'),
      footer: () => import('@/pc/components/footer.vue'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@/pc/views/msg/test.vue'),
      },
    ],
  },
];
