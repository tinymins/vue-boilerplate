/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
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
