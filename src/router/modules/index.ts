/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { RouteConfig } from 'vue-router';

export default [
  {
    path: '/',
    meta: { tabbar: 'main/index' },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/common/main'),
      footer: () => import('@/views/common/footer'),
    },
    redirect: { name: 'sample' },
    children: [
      {
        name: 'sample',
        path: 'sample',
        component: () => import('@/views/sample'),
      },
    ],
  },
  {
    name: '403',
    path: '/403',
    meta: { tabbar: 'main/user', title: '403：无权限' },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/403'),
      footer: () => import('@/views/common/footer'),
    },
  },
  {
    name: '404',
    path: '*',
    meta: { tabbar: 'main/user', title: '404错误：页面不存在' },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/404'),
      footer: () => import('@/views/common/footer'),
    },
  },
] as RouteConfig[];
