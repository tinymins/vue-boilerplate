/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */

export default [
  {
    name: 'popup',
    components: {
      header: () => import('@/pc/views/common/main/index.vue'),
      main: () => import('@/pc/views/popup/index.vue'),
      footer: () => import('@/pc/views/common/main/index.vue'),
    },
  },
];
