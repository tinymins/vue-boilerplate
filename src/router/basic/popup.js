/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-09-02 13:42:33
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 15:30:50
 */
import dynamicRouter from '@/router/dynamic-router';
import routePC from '@/pc/router/popup';

export default dynamicRouter([
  {
    name: 'popup',
    path: '/popup',
    meta: { parent: 'popup', nav: 'popup', title: 'Popup', progressBar: false },
  },
], routePC, routePC);
