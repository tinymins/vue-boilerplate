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
      header: () => import('@/pc/views/common/header/index.vue'),
      main: () => import('@/pc/views/common/main/index.vue'),
      footer: () => import('@/pc/views/common/footer/index.vue'),
    },
    children: [
      {
        name: 'msg_test',
        component: () => import('@/pc/views/msg/test.vue'),
      },
    ],
  },
];
