/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */

export default [
  {
    name: 'msg',
    components: {
      main: () => import('@/m/views/common/main'),
      footer: () => import('@/m/views/common/footer'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@/m/views/msg/test.vue'),
      },
    ],
  },
];
