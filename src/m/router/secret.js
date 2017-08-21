/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:04:47 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:07:14
 */

export default [
  {
    name: 'secret',
    components: {
      tabbar: () => import('@m/components/tabbar.vue'),
      main: () => import('@m/components/main.vue'),
    },
    children: [
      {
        name: 'secret_list',
        component: () => import('@m/views/secret/list.vue'),
      },
    ],
  },
  {
    name: 'secret_posts',
    components: {
      main: () => import('@m/views/secret/posts.vue'),
    },
  },
];
