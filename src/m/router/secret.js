/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 15:08:14
 */

export default [
  {
    name: 'secret',
    components: {
      main: () => import('@/m/views/common/main'),
      footer: () => import('@/m/views/common/footer'),
    },
    children: [
      {
        name: 'secret_index',
        component: () => import('@/m/views/secret/index.vue'),
      },
      {
        name: 'secret_posts',
        component: () => import('@/m/views/secret/posts.vue'),
      },
    ],
  },
];
