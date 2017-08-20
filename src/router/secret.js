/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:15
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:52:09
*/
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/secret',
    name: 'secret',
    redirect: { name: 'secret_list' },
    meta: { parent: 'secret' },
    components: {
      tabbar: () => (
        isMobileDevice()
        ? import('@m/components/tabbar.vue')
        : import('@pc/components/tabbar.vue')
      ),
      main: () => (
        isMobileDevice()
        ? import('@m/components/main.vue')
        : import('@pc/components/main.vue')
      ),
    },
    children: [
      {
        name: 'secret_list',
        path: '/secret',
        meta: { requiresAuth: true, title: '秘密列表' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/secret/list.vue')
          : import('@pc/views/secret/list.vue')
        ),
      },
    ],
  },
  {
    name: 'secret_posts',
    path: '/secret/posts/:id',
    components: {
      main: () => (
        isMobileDevice()
        ? import('@m/views/secret/posts.vue')
        : import('@pc/views/secret/posts.vue')
      ),
    },
  },
];
