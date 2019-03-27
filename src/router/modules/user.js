/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { AUTH_STATE } from '@/config';
import { isDevelop } from '@/utils/environment';

export default [
  {
    name: 'user',
    path: '/user',
    meta: { tabbar: 'secret/user' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'user_index' },
    children: [
      {
        name: 'user_index',
        path: '',
        meta: { auth: AUTH_STATE.LOGGED_IN, title: 'Me' },
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: 'user_login',
        path: 'login',
        component: () => import('@/views/common/main/index.vue'),
        redirect: { name: 'user_login_index' },
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { auth: AUTH_STATE.GUEST, title: 'Login' },
            component: () => import('@/views/user/login.vue'),
          },
          isDevelop()
            ? {
              name: 'user_login_dev',
              path: 'dev',
              meta: { title: 'Dev Login' },
              component: () => import('@/views/user/login_dev.vue'),
            }
            : null,
        ].filter(_ => _),
      },
    ],
  },
];
