/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:15
* @Last Modified by:   William Chan
* @Last Modified time: 2017-04-30 15:07:28
*/
export default [
  {
    path: '/secret',
    name: 'secret',
    redirect: { name: 'secret_test' },
    meta: { parent: 'secret' },
    components: {
      tabbar: import('@/components/tabbar.vue'),
      main: import('@/components/main.vue'),
    },
    children: [
      {
        name: 'secret_test',
        path: 'test',
        component: import('@/views/secret/test.vue'),
      },
    ],
  },
];
