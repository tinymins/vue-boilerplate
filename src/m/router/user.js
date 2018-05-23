/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 10:40:26
 */

export default [
  {
    name: 'user',
    components: {
      main: () => import('@/m/components/main.vue'),
      footer: () => import('@/m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'user_index',
        component: () => import('@/m/views/user/index.vue'),
      },
      {
        name: 'user_login',
        component: () => import('@/m/components/main.vue'),
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
