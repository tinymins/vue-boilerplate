/*
* @Author: William
* @Date:   2017-04-27 15:49:02
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-03 21:32:42
*/
/* eslint-disable global-require */
export default [
  {
    path: '/',
    redirect: { name: 'index' },
    meta: { parent: 'secret', requiresAuth: true },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('@/views/index.vue'),
      },
    ],
  },
  {
    path: '*',
    name: '404',
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/views/404.vue'),
    },
  },
];
