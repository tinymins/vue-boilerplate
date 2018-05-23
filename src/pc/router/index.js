/*
* @Author: William
* @Date:   2017-04-27 15:49:02
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:56:31
*/

export default [
  {
    components: {
      header: () => import('@/pc/components/header.vue'),
      main: () => import('@/pc/components/main.vue'),
      footer: () => import('@/pc/components/footer.vue'),
    },
    children: [
      {
        name: 'index',
        component: () => import('@/pc/views/index/index.vue'),
      },
    ],
  },
  {
    name: '404',
    components: {
      header: () => import('@/pc/components/header.vue'),
      main: () => import('@/pc/views/index/404.vue'),
      footer: () => import('@/pc/components/footer.vue'),
    },
  },
];
