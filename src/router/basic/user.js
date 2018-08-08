/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
