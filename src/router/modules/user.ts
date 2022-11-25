/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { type RouteConfig } from 'vue-router';

import { AUTH_STATE } from '@/config';
import { isInDevMode } from '@/utils/environment';

export const routerUserModule: RouteConfig[] = [
  {
    name: 'user',
    path: '/user',
    meta: { tabbar: 'main/user' },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/common/main'),
      footer: () => import('@/views/common/footer'),
    },
    redirect: { name: 'user_me' },
    children: [
      {
        name: 'user_login',
        path: 'login',
        component: () => import('@/views/common/main'),
        redirect: { name: 'user_login_index' },
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { auth: [AUTH_STATE.GUEST, AUTH_STATE.BLOCKED], title: '登录' },
            component: () => import('@/views/user/login'),
          },
          ...isInDevMode()
            ? [{
              name: 'user_login_dev',
              path: 'dev',
              meta: { title: '开发登录' },
              component: () => import('@/views/user/login-dev'),
            }]
            : [],
        ],
      },
      {
        name: 'user_me',
        path: 'page/me',
        meta: { auth: AUTH_STATE.LOGGED_IN, title: '我的' },
        component: () => import('@/views/user/me'),
      },
    ],
  },
];
