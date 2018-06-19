/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:35 pm
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */

export default [
  {
    name: 'msg',
    components: {
      header: () => import('@/pc/views/common/header/index.vue'),
      main: () => import('@/pc/views/common/main/index.vue'),
      footer: () => import('@/pc/views/common/footer/index.vue'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@/pc/views/msg/test.vue'),
      },
    ],
  },
];
