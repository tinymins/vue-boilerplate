/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   Monday, August 21st 2017, 1:01:01 pm
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:01:48
 */

import { dynamicRouter } from '@/utils/util';

export default [
  {
    name: 'me',
    components: {
      tabbar: () => import('@m/components/tabbar.vue'),
      main: () => import('@m/components/main.vue'),
    },
    children: [
      {
        name: 'me_test',
        component: () => import('@m/views/me/test.vue'),
      },
    ],
  },
];
