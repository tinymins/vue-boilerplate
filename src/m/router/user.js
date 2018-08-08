/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
