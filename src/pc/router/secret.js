/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */

export default [
  {
    name: 'secret',
    components: {
      header: () => import('@/pc/views/common/header/index.vue'),
      main: () => import('@/pc/views/common/main/index.vue'),
      footer: () => import('@/pc/views/common/footer/index.vue'),
    },
    children: [
      {
        name: 'secret_index',
        component: () => import('@/pc/views/secret/index.vue'),
      },
      {
        name: 'secret_posts',
        component: () => import('@/pc/views/secret/posts.vue'),
      },
    ],
  },
];
