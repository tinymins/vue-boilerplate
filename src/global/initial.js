/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-22 15:45:35
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-29 18:39:47
 */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import 'normalize.css';
import '@/global/initial.scss';
import Vue from 'vue';
import wechat from ':/js/jweixin-1.2.0';
import store from '@/store';
import { isLocalhost, isDevelop } from '@/utils/environment';
import { CHROME_EXTENSION } from '@/config/environment';

Vue.config.productionTip = false;
Vue.wechat = wechat;
Vue.prototype.$wechat = wechat;

[
  { name: 'setHeaderTitle', type: 'mutation', path: 'common/COMMON_SET_HEADER_TITLE' },
  { name: 'showLoading', type: 'mutation', path: 'common/COMMON_SHOW_LOADING' },
  { name: 'hideLoading', type: 'mutation', path: 'common/COMMON_HIDE_LOADING' },
  { name: 'pushToast', type: 'mutation', path: 'common/COMMON_PUSH_TOAST' },
  { name: 'popToast', type: 'mutation', path: 'common/COMMON_POP_TOAST' },
  { name: 'pushMessage', type: 'mutation', path: 'common/COMMON_PUSH_MESSAGE' },
  { name: 'popMessage', type: 'mutation', path: 'common/COMMON_POP_MESSAGE' },
].forEach((item) => {
  const handler = (...args) => (
    item.type === 'action'
      ? store.dispatch(item.path, ...args)
      : store.commit(item.path, ...args));
  Vue[item.name] = handler;
  Vue.prototype[`$${item.name}`] = handler;
});

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
    }
  },
});

// Fake all web requests' referer.
if (CHROME_EXTENSION && window.chrome && window.chrome.webRequest && window.chrome.webRequest.onBeforeSendHeaders) {
  window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    const headers = {};
    if (details.type === 'xmlhttprequest') {
      const referer = details.requestHeaders.find(h => h.name === 'Referer');
      if (referer) {
        referer.value = details.url;
      } else {
        details.requestHeaders.push({ name: 'Referer', value: details.url });
      }
      headers.requestHeaders = details.requestHeaders;
    }
    return headers;
  }, { urls: ['http://*/*', 'https://*/*'] }, ['requestHeaders', 'blocking']);
}

if (isDevelop()) {
  const el = document.createElement('div');
  import('eruda').then((eruda) => {
    eruda.init({
      container: el,
      tool: [
        'console',
        'elements',
        'network',
        'resource',
        'info',
        'snippets',
        'sources',
        'feature',
      ],
    });
  });
  document.body.appendChild(el);
}
