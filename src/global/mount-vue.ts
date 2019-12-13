/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import get from 'lodash/get';
import Component from 'vue-class-component';
import Wechat, { wechat } from 'vue-wechat/1.4.0';
import VueLazyload from 'vue-lazyload';
import TransferDom from 'vue-transfer-dom.js';
import PhotoSwipe from 'vue-photoswipe.js';
import PreventOverscroll from 'vue-prevent-overscroll.js';
import 'vue-photoswipe.js/dist/static/css/photoswipe.css';
import { sync } from 'vuex-router-sync';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import { COMMON } from '@/store/types';
import StoreUtils from '@/store/utils';
import { routeClone, RouteInfo } from '@/utils/navigation';
import { configWechatSDK } from '@/utils/connect';
import { isInMobileDevice } from '@/utils/environment';
import ViewportControl from './viewport-control';

const mountVue = (): void => {
  // Mount utils
  if (isInMobileDevice()) {
    ViewportControl.disableZoom();
    ViewportControl.disableSelection();
  }
  ViewportControl.init();

  // Register the router hooks with their names
  Component.registerHooks([
    'asyncData',
    'onWechatReady',
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
  Vue.use(PhotoSwipe, {
    pswpOptions: {
      showShare: false,
      showZoom: false,
      showArrow: false,
      showFullscreen: false,
    },
    wechat,
  });
  Vue.use(VueLazyload);

  Vue.mixin(Vue.extend({
    data(): { $routeInfo: Required<RouteInfo> | null } {
      return {
        $routeInfo: null,
      };
    },
    beforeMount() {
      // Deal with Vue.use() of current component.
      const uses = this.$options.uses;
      if (uses) {
        uses.forEach(entity => Vue.use(entity));
      }
      if (this.$route) {
        this.$routeInfo = routeClone(this.$route);
      }
    },
    mounted() {
      const proto = Object.getPrototypeOf(this);
      const options = this.$options.options || get(proto, 'constructor.options.options');
      if (options) {
        if (options.hideTabbar !== void 0) {
          store.commit(`common/bus/${COMMON.SET_TABBAR_VISIBLE}`, { id: this._uid, value: !options.hideTabbar });
        }
        if (options.hideNavbar !== void 0) {
          store.commit(`common/bus/${COMMON.SET_NAVBAR_VISIBLE}`, { id: this._uid, value: !options.hideNavbar });
        }
        if (options.bodyAutoHeight !== void 0) {
          store.commit(`common/bus/${COMMON.SET_BODY_AUTO_HEIGHT}`, { id: this._uid, value: options.bodyAutoHeight });
        }
        if (options.bodyBackground !== void 0) {
          store.commit(`common/bus/${COMMON.SET_BODY_BACKGROUND}`, { id: this._uid, value: options.bodyBackground });
        }
      }
      const onWechatReady = this.$options.onWechatReady;
      if (onWechatReady) {
        configWechatSDK().then(() => {
          this.$wechat.ready(() => {
            onWechatReady.call(this);
          });
        });
      }
    },
    beforeRouteUpdate(to, from, next) {
      next();
      if (to.name === from.name && to) {
        this.$routeInfo = routeClone(to);
      }
    },
    destroyed() {
      const options = this.$options.options;
      if (options) {
        if (options.hideTabbar !== void 0) {
          store.commit(`common/bus/${COMMON.REMOVE_TABBAR_VISIBLE}`, { id: this._uid });
        }
        if (options.hideNavbar !== void 0) {
          store.commit(`common/bus/${COMMON.REMOVE_NAVBAR_VISIBLE}`, { id: this._uid });
        }
        if (options.bodyAutoHeight !== void 0) {
          store.commit(`common/bus/${COMMON.REMOVE_BODY_AUTO_HEIGHT}`, { id: this._uid });
        }
        if (options.bodyBackground !== void 0) {
          store.commit(`common/bus/${COMMON.REMOVE_BODY_BACKGROUND}`, { id: this._uid });
        }
      }
    },
  }));

  sync(store, router);
  const vue = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
  });
  window.app = vue;
};

export default mountVue;
