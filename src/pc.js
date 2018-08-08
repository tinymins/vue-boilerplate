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
