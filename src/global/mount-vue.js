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
import get from 'lodash/get';
import Component from 'vue-class-component';
import Wechat from 'vue-wechat';
import VueLazyload from 'vue-lazyload';
import TransferDom from 'vue-transfer-dom.js';
import PhotoSwipe from 'vue-photoswipe.js';
import PreventOverscroll from 'vue-prevent-overscroll.js';
import 'vue-photoswipe.js/dist/static/css/photoswipe.css';
import { isLocalhost, isDevelop } from '@/utils/environment';
import { sync } from 'vuex-router-sync';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import { COMMON } from '@/store/types';
import StoreUtils, { showDialog } from '@/store/utils';

const mountVue = () => {
  // Register the router hooks with their names
  Component.registerHooks([
    'asyncData',
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate', // for vue-router 2.2+
  ]);

  // Init Vue
  Vue.config.productionTip = false;
  Vue.use(StoreUtils);
  Vue.use(TransferDom);
  Vue.use(PreventOverscroll);
  Vue.use(Wechat);
  Vue.use(PhotoSwipe, { wechat: Vue.wechat, pswpOptions: { showShare: false } });
  Vue.use(VueLazyload);

  let lastLocation = null;
  Vue.mixin({
    beforeMount() {
      // Deal with Vue.use() of current component.
      const uses = this.$options.uses;
      if (uses) {
        uses.forEach(entity => Vue.use(entity));
      }
    },
    mounted() {
      const proto = Object.getPrototypeOf(this);
      const options = this.$options.options || get(proto, 'constructor.options.options');
      if (options) {
        if (options.hideTabbar !== void 0) {
          store.commit(`common/${COMMON.SET_TABBAR_VISIBLE}`, { id: this._uid, value: !options.hideTabbar });
        }
        if (options.hideNavbar !== void 0) {
          store.commit(`common/${COMMON.SET_NAVBAR_VISIBLE}`, { id: this._uid, value: !options.hideNavbar });
        }
        if (options.bodyAutoHeight !== void 0) {
          store.commit(`common/${COMMON.SET_BODY_AUTO_HEIGHT}`, { id: this._uid, value: options.bodyAutoHeight });
        }
        if (options.bodyBackground !== void 0) {
          store.commit(`common/${COMMON.SET_BODY_BACKGROUND}`, { id: this._uid, value: options.bodyBackground });
        }
      }
      if (this.$options.onWechatReady) {
        // Init wechat SDK
        const url = window.location.href;
        if (!isLocalhost() && url !== lastLocation) {
          // bind wechat sdk error function.
          Vue.wechat.error((e) => {
            showDialog({
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
            store.dispatch(`common/${COMMON.GET_WECHAT_SDK_INFO}`, { url }).then((info) => {
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
        if (options.hideTabbar !== void 0) {
          store.commit(`common/${COMMON.REMOVE_TABBAR_VISIBLE}`, { id: this._uid });
        }
        if (options.hideNavbar !== void 0) {
          store.commit(`common/${COMMON.REMOVE_NAVBAR_VISIBLE}`, { id: this._uid });
        }
        if (options.bodyAutoHeight !== void 0) {
          store.commit(`common/${COMMON.REMOVE_BODY_AUTO_HEIGHT}`, { id: this._uid });
        }
        if (options.bodyBackground !== void 0) {
          store.commit(`common/${COMMON.REMOVE_BODY_BACKGROUND}`, { id: this._uid });
        }
      }
    },
  });

  sync(store, router);
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
  });
};

export default mountVue;
