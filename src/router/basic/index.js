/**
 * @Author: William
 * @Date:   2017-04-27 15:49:02
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
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
