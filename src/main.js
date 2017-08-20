// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui

import Vue from 'vue';
import Mint from 'mint-ui';
import { sync } from 'vuex-router-sync';
import 'normalize.css';
import 'mint-ui/lib/style.css';
import '@/styles/main.scss';
import App from '@/App';
import router from '@/router';
import { store } from '@/store';


Vue.config.productionTip = false;
Vue.use(Mint);
sync(store, router);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
