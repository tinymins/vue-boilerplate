/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-09-07 17:37:04
 */

export default [
  {
    name: 'secret',
    components: {
      main: () => import('@m/components/main.vue'),
      footer: () => import('@m/components/tabbar.vue'),
    },
    children: [
      {
        name: 'secret_index',
        component: () => import('@m/views/secret/index.vue'),
      },
      {
        name: 'secret_posts',
        component: () => import('@m/views/secret/posts.vue'),
      },
    ],
  },
];
