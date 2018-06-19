/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */

export default [
  {
    name: 'user',
    components: {
      main: () => import('@/m/views/common/main/index.vue'),
      footer: () => import('@/m/views/common/footer/index.vue'),
    },
    children: [
      {
        name: 'user_index',
        component: () => import('@/m/views/user/index.vue'),
      },
      {
        name: 'user_login',
        component: () => import('@/m/views/common/main/index.vue'),
        children: [
          {
            name: 'user_login_index',
            component: () => import('@/m/views/user/login.vue'),
          },
          {
            name: 'user_login_dev',
            component: () => import('@/m/views/user/login_dev.vue'),
          },
        ],
      },
    ],
  },
];
