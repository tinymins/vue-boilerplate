/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
export default [
  {
    name: 'msg',
    path: '/msg',
    meta: { parent: 'msg', nav: 'msg', requiresAuth: true },
    components: {
      main: () => import('@/views/common/main'),
      footer: () => import('@/views/common/footer'),
    },
    redirect: { name: 'msg_test' },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'Message' },
        component: () => import('@/views/msg/test.vue'),
      },
    ],
  },
];
