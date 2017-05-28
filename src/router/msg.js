/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:11
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:52:39
*/
export default [
  {
    path: '/msg',
    name: 'msg',
    redirect: { name: 'msg_test' },
    meta: { parent: 'msg', requiresAuth: true },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'msg' },
        component: () => import('@/views/msg/test.vue'),
      },
    ],
  },
];
