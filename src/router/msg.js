/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:11
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 15:01:02
*/
export default [
  {
    path: '/msg',
    name: 'msg',
    redirect: { name: 'msg_test' },
    meta: { parent: 'msg' },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        component: () => import('@/views/msg/test.vue'),
      },
    ],
  },
];
