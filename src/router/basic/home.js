/**
 * @Author: William
 * @Date:   2017-04-27 15:49:07
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:47:11
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/home';
import routePC from '@/pc/router/home';

export default dynamicRouter([
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'home_test' },
    meta: { parent: 'home', requiresAuth: true, title: '首页' },
    children: [
      {
        name: 'home_test',
        path: 'test',
        meta: { title: '首页' },
      },
    ],
  },
], routeM, routePC);
