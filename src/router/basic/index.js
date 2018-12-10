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
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'index' },
    children: [
      {
        name: 'index',
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/index/index.vue'),
      },
    ],
  },
  {
    name: '404',
    path: '*',
    components: {
      main: () => import('@/views/index/404.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
