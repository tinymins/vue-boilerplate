/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:15
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:18:47
*/
export default [
  {
    path: '/secret',
    name: 'secret',
    redirect: { name: 'secret_list' },
    meta: { parent: 'secret' },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'secret_list',
        path: '/secret',
        meta: { requiresAuth: true },
        component: () => import('@/views/secret/list.vue'),
      },
    ],
  },
  {
    name: 'secret_posts',
    path: '/secret/posts/:id',
    components: {
      main: () => import('@/views/secret/posts.vue'),
    },
  },
];
