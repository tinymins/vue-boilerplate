/**
 * @Author: William
 * @Date:   2017-04-27 15:49:07
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:20:48
 */
import { dynamicRouter } from '@/utils/util';
import routeM from '@/m/router/debug';
import routePC from '@/pc/router/debug';

export default dynamicRouter([
  {
    path: '/debug',
    name: 'debug',
    redirect: { name: 'debug_index' },
    meta: { parent: 'debug' },
    children: [
      {
        name: 'debug_index',
        path: '/debug',
        meta: { title: 'debug' },
      },
    ],
  },
], routeM, routePC);
