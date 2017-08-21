/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:11
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:27:29
 */
import { dynamicRouter } from '@/utils/util';
import routeM from '@/m/router/msg';
import routePC from '@/pc/router/msg';

export default dynamicRouter([
  {
    path: '/msg',
    name: 'msg',
    redirect: { name: 'msg_test' },
    meta: { parent: 'msg', requiresAuth: true },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'msg' },
      },
    ],
  },
], routeM, routePC);
