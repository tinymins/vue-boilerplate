/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 16:39:24
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
        component: () => import('@/views/debug/index.vue'),
      },
    ],
  },
];
