/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import '@/global/initial';
import '@/styles/index.scss';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import FastClick from 'fastclick';

if (window.navigator.userAgent.indexOf('iPad') > -1) {
  FastClick.attach(document.body);
}

sync(store, router);
const config = {
  el: '#app',
  components: { App },
  router,
  store,
  render: h => h(App),
};
new Vue(config);
