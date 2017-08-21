/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:19
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:47:14
*/
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/me';
import routePC from '@/pc/router/me';

export default dynamicRouter([
  {
    path: '/me',
    name: 'me',
    redirect: { name: 'me_test' },
    meta: { parent: 'me', requiresAuth: true },
    children: [
      {
        name: 'me_test',
        path: 'test',
        meta: { requiresAuth: true, title: '我的' },
      },
    ],
  },
], routeM, routePC);
