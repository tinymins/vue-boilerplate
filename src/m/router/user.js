/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-22 20:47:06
 */

export default [
  {
    name: 'user',
    components: {
      main: () => import('@m/components/main.vue'),
    },
    children: [
      {
        name: 'user_login',
        component: () => import('@m/views/user/login.vue'),
      },
    ],
  },
];
