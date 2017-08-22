/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-22 20:48:58
 */

export default [
  {
    name: 'user',
    components: {
      header: () => import('@pc/components/header'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'user_login',
        component: () => import('@pc/views/user/login.vue'),
      },
    ],
  },
];
