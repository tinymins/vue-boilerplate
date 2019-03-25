/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of chrome extension build
 */

import 'normalize.css';
import '@babel/polyfill';
import mountVue from './global/mount-vue';
import '@/styles/index.scss';

document.body.className = 'pc';
document.documentElement.className = 'pc';

// Fake all web requests' referer.
if (window.chrome && window.chrome.webRequest && window.chrome.webRequest.onBeforeSendHeaders) {
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

mountVue();
