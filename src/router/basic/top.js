/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
export default [
  {
    path: '/',
    meta: { parent: 'index', nav: 'index' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'index' },
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('@/views/index/index.vue'),
      },
    ],
  },
  {
    name: '404',
    path: '*',
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/404'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
