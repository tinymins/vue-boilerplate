/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
export default [
  {
    name: 'popup',
    path: '/popup',
    meta: { parent: 'popup', nav: 'popup', title: 'Popup', progressBar: false },
    components: {
      header: () => import('@/views/common/main/index.vue'),
      main: () => import('@/views/popup/index.vue'),
      footer: () => import('@/views/common/main/index.vue'),
    },
  },
];
