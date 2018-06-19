/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-09-02 13:42:33
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
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
