/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:35 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:09:07
 */

export default [
  {
    name: 'msg',
    components: {
      tabbar: () => import('@pc/components/tabbar.vue'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@pc/views/msg/test.vue'),
      },
    ],
  },
];
