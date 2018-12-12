/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import 'normalize.css';
import FastClick from 'fastclick';
import { isDevelop, isInMobileDevice } from '@/utils/environment';
import { CHROME_EXTENSION } from '@/config/environment';
import flexible from './global/flexible';
import mountVue from './global/mount-vue';
import '@/styles/index.scss';

if (isInMobileDevice()) {
  flexible();
  document.body.className = 'mobile';
  document.documentElement.className = 'mobile';
} else {
  document.body.className = 'pc';
  document.documentElement.className = 'pc';
}

if (window.navigator.userAgent.indexOf('iPad') > -1) {
  FastClick.attach(document.body);
}

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

if (isDevelop(true)) {
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
    mountVue();
  });
  document.body.appendChild(el);
} else {
  mountVue();
}
