/**
 * @Author: William Chan
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
