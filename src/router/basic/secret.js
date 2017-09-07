/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:15
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-09-07 17:36:01
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/secret';
import routePC from '@/pc/router/secret';

export default dynamicRouter([
  {
    path: '/secret',
    name: 'secret',
    meta: { parent: 'secret', nav: 'secret' },
    redirect: { name: 'secret_index' },
    children: [
      {
        name: 'secret_index',
        path: '',
        meta: { requiresAuth: true, title: '秘密列表' },
      },
      {
        name: 'secret_posts',
        path: 'posts/:id',
        meta: { title: '秘密详情' },
      },
    ],
  },
], routeM, routePC);
