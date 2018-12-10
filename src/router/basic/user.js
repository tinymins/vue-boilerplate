/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { isDevelop } from '@/utils/environment';

export default [
  {
    name: 'user',
    path: '/user',
    meta: { parent: 'user', nav: 'user' },
    components: {
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'user_index' },
    children: [
      {
        name: 'user_index',
        path: '',
        meta: { title: 'Me', requiresAuth: true },
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: 'user_login',
        path: 'login',
        component: () => import('@/views/common/main/index.vue'),
        redirect: { name: isDevelop() ? 'user_login_dev' : 'user_login_index' },
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { title: 'Login', requiresGuest: true },
            component: () => import('@/views/user/login.vue'),
          },
          {
            name: 'user_login_dev',
            path: 'dev',
            meta: { title: 'Dev Login', requiresGuest: true },
            component: () => import('@/views/user/login_dev.vue'),
          },
        ],
      },
    ],
  },
];
