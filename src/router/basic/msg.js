/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:11
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-23 08:40:58
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/msg';
import routePC from '@/pc/router/msg';

export default dynamicRouter([
  {
    path: '/msg',
    name: 'msg',
    meta: { parent: 'msg', nav: 'msg', requiresAuth: true },
    redirect: { name: 'msg_test' },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'Message' },
      },
    ],
  },
], routeM, routePC);
