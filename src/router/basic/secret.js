/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
export default [
  {
    name: 'secret',
    path: '/secret',
    meta: { parent: 'secret', nav: 'secret' },
    components: {
      main: () => import('@/views/common/main'),
      footer: () => import('@/views/common/footer'),
    },
    redirect: { name: 'secret_index' },
    children: [
      {
        name: 'secret_index',
        path: '',
        meta: { requiresAuth: true, title: '秘密列表' },
        component: () => import('@/views/secret/index.vue'),
      },
      {
        name: 'secret_posts',
        path: 'posts/:id',
        meta: { title: '秘密详情' },
        component: () => import('@/views/secret/posts.vue'),
      },
    ],
  },
];
