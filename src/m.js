/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import ':/js/flexible';
import '@/global/initial';
import '@/pc/styles/main.scss';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from '@/m/App';
import router from '@/router';
import store from '@/store';
import FastClick from 'fastclick';
import { Dialog, Style, Toast } from 'cube-ui';
import { CHROME_EXTENSION } from '@/config/environment';

Vue.use(Style);
Vue.use(Dialog);
Vue.use(Toast);

sync(store, router);
const config = {
  el: '#app',
  components: { App },
  router,
  store,
};
if (CHROME_EXTENSION) {
  config.render = h => h(App);
} else {
  config.template = '<App/>';
}
new Vue(config);

if (window.navigator.userAgent.indexOf('iPad') > -1) {
  FastClick.attach(document.body);
}
