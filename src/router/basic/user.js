/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-22 20:44:51
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/user';
import routePC from '@/pc/router/user';

export default dynamicRouter([
  {
    path: '/user',
    name: 'user',
    redirect: { name: 'user_login' },
    meta: { requiresAuth: false, requiresGuest: true },
    children: [
      {
        name: 'user_login',
        path: 'login',
        meta: { title: '登录' },
      },
    ],
  },
], routeM, routePC);
