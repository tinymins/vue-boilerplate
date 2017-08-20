/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:51:36
*/
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'home_test' },
    meta: { parent: 'home', requiresAuth: true, title: '首页' },
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
        name: 'home_test',
        path: 'test',
        meta: { title: '首页' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/home/test.vue')
          : import('@pc/views/home/test.vue')
        ),
      },
    ],
  },
];
