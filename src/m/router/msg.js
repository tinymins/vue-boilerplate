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
      main: () => import('@/m/views/common/main'),
      footer: () => import('@/m/views/common/footer'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@/m/views/msg/test.vue'),
      },
    ],
  },
];
