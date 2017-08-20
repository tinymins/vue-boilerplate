/*
* @Author: William Chan
* @Date:   2017-04-27 15:49:19
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:52:50
*/
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/me',
    name: 'me',
    redirect: { name: 'me_test' },
    meta: { parent: 'me', requiresAuth: true },
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
        name: 'me_test',
        path: 'test',
        meta: { requiresAuth: true, title: '我的' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/me/test.vue')
          : import('@pc/views/me/test.vue')
        ),
      },
    ],
  },
];
