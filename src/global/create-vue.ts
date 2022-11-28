/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/*
 * The Vue build version to load with the `import` command
 * (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 */

import 'vue-photoswipe.js/dist/static/css/photoswipe.css';

import get from 'lodash/get';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import VueLazyload from 'vue-lazyload';
import PhotoSwipe from 'vue-photoswipe.js';
import PreventOverscroll from 'vue-prevent-overscroll.js';
import Wechat, { wechat } from 'vue-wechat/1.4.0';
import { sync } from 'vuex-router-sync';

import { configWechatSDK } from '@/utils/connect';
import { isInMobileDevice } from '@/utils/environment';
import { routeClone } from '@/utils/navigation';
import { RouterInstance } from '@/router';
import { StoreInstance } from '@/store';
import { COMMON } from '@/store/common';
import StoreUtils from '@/store/utils';
import App from '@/app';

import ViewportControl from './viewport-control';

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
Vue.use(PortalVue);
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

Object.defineProperty(Vue.prototype, '$routeInfo', { get() { return routeClone(this.$route); } });

Vue.mixin(Vue.extend({
  beforeMount() {
    // Deal with Vue.use() of current component.
    const uses = (this as Vue).$options.uses;
    if (uses) {
      uses.forEach(entity => Vue.use(entity));
    }
  },
  mounted() {
    const proto = Object.getPrototypeOf(this);
    const options = this.$options.options || get(proto, 'constructor.options.options');
    if (options) {
      if (options.hideTabbar !== void 0) {
        this.$store.commit(`common/bus/${COMMON.SET_TABBAR_VISIBLE}`, { id: this._uid, value: !options.hideTabbar });
      }
      if (options.hideNavbar !== void 0) {
        this.$store.commit(`common/bus/${COMMON.SET_NAVBAR_VISIBLE}`, { id: this._uid, value: !options.hideNavbar });
      }
      if (options.bodyAutoHeight !== void 0) {
        this.$store.commit(`common/bus/${COMMON.SET_BODY_AUTO_HEIGHT}`, { id: this._uid, value: options.bodyAutoHeight });
      }
      if (options.bodyBackground !== void 0) {
        this.$store.commit(`common/bus/${COMMON.SET_BODY_BACKGROUND}`, { id: this._uid, value: options.bodyBackground });
      }
    }
    const onWechatReady = this.$options.onWechatReady;
    if (onWechatReady) {
      configWechatSDK(this.$store)
        .then((res) => {
          this.$wechat.ready(() => {
            onWechatReady.call(this);
          });
          return res;
        })
        .catch((error: unknown) => { throw error; });
    }
  },
  destroyed() {
    const proto = Object.getPrototypeOf(this);
    const options = this.$options.options || get(proto, 'constructor.options.options');
    if (options) {
      if (options.hideTabbar !== void 0) {
        this.$store.commit(`common/bus/${COMMON.REMOVE_TABBAR_VISIBLE}`, { id: this._uid });
      }
      if (options.hideNavbar !== void 0) {
        this.$store.commit(`common/bus/${COMMON.REMOVE_NAVBAR_VISIBLE}`, { id: this._uid });
      }
      if (options.bodyAutoHeight !== void 0) {
        this.$store.commit(`common/bus/${COMMON.REMOVE_BODY_AUTO_HEIGHT}`, { id: this._uid });
      }
      if (options.bodyBackground !== void 0) {
        this.$store.commit(`common/bus/${COMMON.REMOVE_BODY_BACKGROUND}`, { id: this._uid });
      }
    }
  },
}));

const createVue = (store: StoreInstance, router: RouterInstance): Vue => {
  // Mount utils
  if (store.state.common.app.entryParams && isInMobileDevice(store.state.common.app.entryParams.userAgent)) {
    ViewportControl.disableZoom();
    ViewportControl.disableSelection();
  }
  ViewportControl.init();

  sync(store, router);
  return new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
  });
};

export default createVue;
