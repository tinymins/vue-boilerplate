/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-23 08:18:23
 */

export default [
  {
    name: 'user',
    components: {
      main: () => import('@m/components/main.vue'),
    },
    children: [
      {
        name: 'user_index',
        component: () => import('@m/views/user/index.vue'),
      },
      {
        name: 'user_login',
        component: () => import('@m/views/user/login.vue'),
      },
      {
        name: 'user_login_dev',
        component: () => import('@m/views/user/login_dev.vue'),
      },
    ],
  },
];
