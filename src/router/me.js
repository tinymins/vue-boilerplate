/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:19
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-03 21:16:17
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
        component: () => import('@/views/me/test.vue'),
      },
    ],
  },
];
