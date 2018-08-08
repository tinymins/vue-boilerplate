/**
 * @Author: William
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
import dynamicRouter from '@/router/dynamic-router';
import routeM from '@/m/router/index';
import routePC from '@/pc/router/index';

export default dynamicRouter([
  {
    path: '/',
    meta: { parent: 'index', nav: 'index' },
    redirect: { name: 'index' },
    children: [
      {
        name: 'index',
        path: '',
        meta: { title: '首页' },
      },
    ],
  },
  {
    path: '*',
    name: '404',
  },
], routeM, routePC);
