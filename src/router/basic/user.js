/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-23 08:40:48
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/user';
import routePC from '@/pc/router/user';

export default dynamicRouter([
  {
    path: '/user',
    name: 'user',
    meta: { parent: 'user', nav: 'user' },
    redirect: { name: 'user_index' },
    children: [
      {
        name: 'user_index',
        path: '',
        meta: { title: 'Me', requiresAuth: true },
      },
      {
        name: 'user_login',
        path: 'login',
        meta: { title: 'Login', requiresGuest: true },
      },
      {
        name: 'user_login_dev',
        path: 'login_dev',
        meta: { title: 'Dev Login', requiresGuest: true },
      },
    ],
  },
], routeM, routePC);
