/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-22 15:45:35
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-08 17:28:13
 */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
import 'normalize.css';
import Vue from 'vue';
import DomPortal from 'vue-dom-portal';
import WechatPlugin from 'tencent-wx-jssdk';
import store from '@/store';
import { isLocalhost, isDevelop } from '@/utils/environment';

Vue.use(DomPortal);

Vue.config.productionTip = false;
Vue.wechat = WechatPlugin;
Vue.prototype.$wechat = WechatPlugin;

let lastLocation = null;
Vue.mixin({
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
});

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
