/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:11
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:52:39
*/
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/msg',
    name: 'msg',
    redirect: { name: 'msg_test' },
    meta: { parent: 'msg', requiresAuth: true },
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
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'msg' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/msg/test.vue')
          : import('@pc/views/msg/test.vue')
        ),
      },
    ],
  },
];
