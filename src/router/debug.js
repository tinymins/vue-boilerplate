/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:51:45
*/
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/debug',
    name: 'debug',
    redirect: { name: 'debug_index' },
    meta: { parent: 'debug' },
    components: {
      tabbar: () => (
        isMobileDevice()
          ? import('@m/components/tabbar.vue')
          : import('@pc/components/tabbar.vue')
      ),
      main: () => (
        isMobileDevice()
          ? import('@m/components/main.vue')
          : import('@pc/components/main.vue')
      ),
    },
    children: [
      {
        name: 'debug_index',
        path: '/debug',
        meta: { title: 'debug' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/debug/index.vue')
          : import('@pc/views/debug/index.vue')
        ),
      },
    ],
  },
];
