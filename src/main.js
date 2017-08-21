// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui

import Vue from 'vue';
import Mint from 'mint-ui';
import { sync } from 'vuex-router-sync';
import 'normalize.css';
import 'mint-ui/lib/style.css';
import '@/styles/main.scss';
import AppM from '@/m/App';
import AppPC from '@/pc/App';
import router from '@/router';
import { store } from '@/store';
import { isMobileDevice } from '@/utils/util';


Vue.config.productionTip = false;
Vue.use(Mint);
sync(store, router);
/* eslint-disable no-new */
if (isMobileDevice()) {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<AppM/>',
    components: { AppM },
  });
} else {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<AppPC/>',
    components: { AppPC },
  });
}
