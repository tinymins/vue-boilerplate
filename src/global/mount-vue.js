/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable no-new */
/* eslint-disable no-console */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import Wechat from 'vue-wechat';
import PhotoSwipe from 'vue-photoswipe.js';
import 'vue-photoswipe.js/dist/static/css/photoswipe.css';
import { isLocalhost, isDevelop } from '@/utils/environment';
import { sync } from 'vuex-router-sync';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import StoreUtils from '@/store/utils';

const mountVue = () => {
  Vue.config.productionTip = false;
  Vue.use(StoreUtils);
  Vue.use(Wechat);
  Vue.use(PhotoSwipe, { wechat: Vue.wechat, pswpOptions: { showShare: false } });

  let lastLocation = null;
  Vue.mixin({
    beforeMount() {
      const options = this.$options.options;
      if (options) {
        if (options.hideTabbar !== undefined) {
          store.commit('common/COMMON_SET_TABBAR_VISIBLE', !options.hideTabbar);
        }
        if (options.hideNavbar !== undefined) {
          store.commit('common/COMMON_SET_NAVBAR_VISIBLE', !options.hideNavbar);
        }
        if (options.bodyAutoHeight !== undefined) {
          store.commit('common/COMMON_SET_BODY_AUTO_HEIGHT', options.bodyAutoHeight);
        }
        if (options.bodyBackground !== undefined) {
          store.commit('common/COMMON_SET_BODY_BACKGROUND', options.bodyBackground);
        }
      }
      // Deal with Vue.use() of current component.
      const uses = this.$options.uses;
      if (uses) {
        uses.forEach(entity => Vue.use(entity));
      }
    },
    mounted() {
      if (this.$options.onWechatReady) {
        // Init wechat SDK
        const url = window.location.href;
        if (!isLocalhost() && url !== lastLocation) {
          // bind wechat sdk error function.
          Vue.wechat.error((e) => {
            store.commit('COMMON_PUSH_MESSAGE', {
              title: 'Wechat SDK error',
              content: e.errMsg,
            });
            if (e.errMsg === 'config:invalid signature') {
              if (!isDevelop()) {
                window.location.reload();
              }
              console.error(e);
            }
          });
          // start initing wechat sdk.
          Promise.resolve().then(() => {
            store.dispatch('common/COMMON_GET_WECHAT_SDK_INFO', { url }).then((info) => {
              Vue.wechat.config({
                debug: info.debug,
                appId: info.appId,
                timestamp: info.timestamp,
                nonceStr: info.nonceStr,
                signature: info.signature,
                jsApiList: info.jsApiList,
              });
            });
          });
          lastLocation = url;
        }
        this.$wechat.ready(() => {
          this.$options.onWechatReady.call(this);
        });
      }
    },
    destroyed() {
      const options = this.$options.options;
      if (options) {
        if (options.hideTabbar !== undefined) {
          store.commit('common/COMMON_REVERT_TABBAR_VISIBLE');
        }
        if (options.hideNavbar !== undefined) {
          store.commit('common/COMMON_REVERT_NAVBAR_VISIBLE');
        }
        if (options.bodyAutoHeight !== undefined) {
          store.commit('common/COMMON_REVERT_BODY_AUTO_HEIGHT');
        }
        if (options.bodyBackground !== undefined) {
          store.commit('common/COMMON_REVERT_BODY_BACKGROUND');
        }
      }
    },
  });


  sync(store, router);
  new Vue({
    el: '#app',
    components: { App },
    router,
    store,
    template: '<App/>',
  });
};

export default mountVue;
