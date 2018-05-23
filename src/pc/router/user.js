/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 15:13:22
 */

export default [
  {
    name: 'user',
    components: {
      header: () => import('@/pc/views/common/header/index.vue'),
      main: () => import('@/pc/views/common/main/index.vue'),
    },
    children: [
      {
        name: 'user_index',
        component: () => import('@/pc/views/user/index.vue'),
      },
      {
        name: 'user_login',
        component: () => import('@/pc/views/common/main/index.vue'),
        children: [
          {
            name: 'user_login_index',
            component: () => import('@/pc/views/user/login.vue'),
          },
          {
            name: 'user_login_dev',
            component: () => import('@/pc/views/user/login_dev.vue'),
          },
        ],
      },
    ],
  },
];
