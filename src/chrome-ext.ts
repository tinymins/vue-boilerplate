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
import mountVue from '@/global/mount-vue';
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

mountVue();
