/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-06 18:23:04
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 17:03:23
 */
/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import '@/global/initial';
import '@/pc/styles/main.scss';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from '@/pc/App';
import router from '@/router';
import store from '@/store';
import { CHROME_EXTENSION } from '@/config/environment';

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
