/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
import { isDevelop } from '@/utils/environment';
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
        redirect: { name: isDevelop() ? 'user_login_dev' : 'user_login_index' },
        path: 'login',
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { title: 'Login', requiresGuest: true },
          },
          {
            name: 'user_login_dev',
            path: 'dev',
            meta: { title: 'Dev Login', requiresGuest: true },
          },
        ],
      },
    ],
  },
], routeM, routePC);
