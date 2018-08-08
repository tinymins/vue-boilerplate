/**
 * @Author: William Chan
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
