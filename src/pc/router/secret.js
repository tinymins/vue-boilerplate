/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 15:28:30
 */

export default [
  {
    name: 'secret',
    components: {
      header: () => import('@pc/components/header.vue'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'secret_list',
        component: () => import('@pc/views/secret/list.vue'),
      },
    ],
  },
  {
    name: 'secret_posts',
    components: {
      main: () => import('@pc/views/secret/posts.vue'),
    },
  },
];
