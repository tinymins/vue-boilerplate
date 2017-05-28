/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:19
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:52:50
*/
export default [
  {
    path: '/me',
    name: 'me',
    redirect: { name: 'me_test' },
    meta: { parent: 'me', requiresAuth: true },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'me_test',
        path: 'test',
        meta: { requiresAuth: true, title: '我的' },
        component: () => import('@/views/me/test.vue'),
      },
    ],
  },
];
