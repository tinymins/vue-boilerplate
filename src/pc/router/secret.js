/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 10:40:53
 */

export default [
  {
    name: 'secret',
    components: {
      header: () => import('@/pc/components/header.vue'),
      main: () => import('@/pc/components/main.vue'),
      footer: () => import('@/pc/components/footer.vue'),
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
