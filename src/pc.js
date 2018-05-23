/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-06 18:23:04
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 10:29:43
 */
/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui

import '@/global/initial';
import '@/pc/styles/main.scss';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from '@/pc/App';
import router from '@/router';
import store from '@/store';

sync(store, router);
new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>',
});
