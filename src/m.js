/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-06 18:23:04
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-24 16:03:23
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

Vue.use(Style);
Vue.use(Dialog);
Vue.use(Toast);

sync(store, router);
new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>',
});
if (window.navigator.userAgent.indexOf('iPad') > -1) {
  FastClick.attach(document.body);
}
