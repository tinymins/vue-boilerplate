/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-03 21:19:47
*/
export default [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'home_test' },
    meta: { parent: 'home', requiresAuth: true },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'home_test',
        path: 'test',
        component: () => import('@/views/home/test.vue'),
      },
    ],
  },
];
