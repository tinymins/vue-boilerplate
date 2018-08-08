/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
