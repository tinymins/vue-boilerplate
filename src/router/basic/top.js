/**
 * @Author: William
 * @Date:   2017-04-27 15:49:02
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:47:23
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/top';
import routePC from '@/pc/router/top';

export default dynamicRouter([
  {
    path: '/',
    redirect: { name: 'index' },
    meta: { requiresAuth: true },
    children: [
      {
        name: 'index',
        path: '',
        meta: { requiresAuth: true, title: 'index' },
      },
    ],
  },
  {
    path: '*',
    name: '404',
  },
], routeM, routePC);
