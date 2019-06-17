/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Vue from 'vue'
import VueRouter, { Route } from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    $route: Route,
    $router: VueRouter,
  }
}
