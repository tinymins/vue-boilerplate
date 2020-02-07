/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of chrome extension build
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import get from 'lodash/get';
import createWedge from '@/global/create-wedge';
import createVue from '@/global/create-vue';
import { COMMON } from '@/store/types';
import '@/styles/index.scss';

document.body.className = 'pc';
document.documentElement.className = 'pc';

// Fake all web requests' referer.
const onBeforeSendHeaders = get(window, 'chrome.webRequest.onBeforeSendHeaders');
if (onBeforeSendHeaders) {
  onBeforeSendHeaders.addListener((details) => {
    if (details.type === 'xmlhttprequest') {
      const referer = details.requestHeaders.find(h => h.name === 'Referer');
      if (referer) {
        referer.value = details.url;
      } else {
        details.requestHeaders.push({ name: 'Referer', value: details.url });
      }
      return { requestHeaders: details.requestHeaders };
    }
    return {};
  }, { urls: ['<all_urls>'] }, ['requestHeaders', 'blocking']);
}

const { store, http, router } = createWedge();
store.commit(`common/app/${COMMON.STORE_INSTANCE}`, store);
store.commit(`common/app/${COMMON.HTTP_INSTANCE}`, http);
store.commit(`common/app/${COMMON.ROUTER_INSTANCE}`, router);
// store.commit('HTTP_REQUEST', entryParams);
createVue(store, router);