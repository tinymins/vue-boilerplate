/*
* @Author: William
* @Date:   2017-04-27 15:49:02
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:56:31
*/
/* eslint-disable global-require */
import { isMobileDevice } from '@/utils/util';

export default [
  {
    path: '/',
    redirect: { name: 'index' },
    meta: { requiresAuth: true },
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
        name: 'index',
        path: '',
        meta: { requiresAuth: true, title: 'index' },
        component: () => (
          isMobileDevice()
          ? import('@m/views/index.vue')
          : import('@pc/views/index.vue')
        ),
      },
    ],
  },
  {
    path: '*',
    name: '404',
    components: {
      tabbar: () => (
        isMobileDevice()
        ? import('@m/components/tabbar.vue')
        : import('@pc/components/tabbar.vue')
      ),
      main: () => (
        isMobileDevice()
        ? import('@m/views/404.vue')
        : import('@pc/views/404.vue')
      ),
    },
  },
];
