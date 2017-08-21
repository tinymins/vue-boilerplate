// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui

import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import 'normalize.css';
import router from '@/router';
import { store } from '@/store';
import { isMobileDevice } from '@/utils/util';

Vue.config.productionTip = false;

// load different framework
(isMobileDevice()
  ? Promise.all([
    new Promise((resolve, reject) => {
      import('mint-ui').then((Mint) => {
        Vue.use(Mint);
        resolve();
      }).catch(reject);
    }),
    import('mint-ui/lib/style.css'),
    import('@/m/styles/main.scss'),
  ])
  : Promise.all([
    new Promise((resolve, reject) => {
      import('element-ui').then((ElementUI) => {
        Vue.use(ElementUI);
        resolve();
      }).catch(reject);
    }),
    import('element-ui/lib/theme-default/index.css'),
    import('@/pc/styles/main.scss'),
  ])
).then(() => {
  /* eslint-disable no-new */
  sync(store, router);
  const promise = isMobileDevice() ? import('@/m/App') : import('@/pc/App');
  promise.then((App) => {
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App },
    });
  });
});
