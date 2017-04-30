/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:19
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-30 15:06:44
*/
export default [
  {
    path: '/me',
    name: 'me',
    redirect: { name: 'me_test' },
    meta: { parent: 'me' },
    components: {
      tabbar: import('@/components/tabbar.vue'),
      main: import('@/components/main.vue'),
    },
    children: [
      {
        name: 'me_test',
        path: 'test',
        component: import('@/views/me/test.vue'),
      },
    ],
  },
];
