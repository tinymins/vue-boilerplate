/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:02:03 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:02:79
 */

import { dynamicRouter } from '@/utils/util';

export default [
  {
    name: 'me',
    components: {
      tabbar: () => import('@pc/components/tabbar.vue'),
      main: () => import('@pc/components/main.vue'),
    },
    children: [
      {
        name: 'me_test',
        component: () => import('@pc/views/me/test.vue'),
      },
    ],
  },
];
