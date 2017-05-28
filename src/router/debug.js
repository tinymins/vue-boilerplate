/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:51:45
*/
export default [
  {
    path: '/debug',
    name: 'debug',
    redirect: { name: 'debug_index' },
    meta: { parent: 'debug' },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'debug_index',
        path: '/debug',
        meta: { title: 'debug' },
        component: () => import('@/views/debug/index.vue'),
      },
    ],
  },
];
