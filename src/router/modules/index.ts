/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type RouteConfig } from 'vue-router';

import { routerDefaultModule } from './default';
import { routerPopupModule } from './popup';
import { routerUserModule } from './user';

const routerModules: RouteConfig[][] = [
  routerUserModule,
  routerPopupModule,

  // default router must be the last one
  routerDefaultModule,
];

export default routerModules;
