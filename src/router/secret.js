/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:15
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-21 13:27:38
 */
import { dynamicRouter } from '@/utils/util';
import routeM from '@/m/router/secret';
import routePC from '@/pc/router/secret';

export default dynamicRouter([
  {
    path: '/secret',
    name: 'secret',
    redirect: { name: 'secret_list' },
    meta: { parent: 'secret' },
    children: [
      {
        name: 'secret_list',
        path: '/secret',
        meta: { requiresAuth: true, title: '秘密列表' },
      },
    ],
  },
  {
    name: 'secret_posts',
    path: '/secret/posts/:id',
  },
], routeM, routePC);
