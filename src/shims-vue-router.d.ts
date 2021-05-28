/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import VueRouter, { Route } from 'vue-router';
import { RouteInfo } from '@/utils/navigation';

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $routeInfo: Required<RouteInfo>;
  }
}
