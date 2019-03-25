/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of normal web-app build
 */

import 'normalize.css';
import '@babel/polyfill';
import FastClick from 'fastclick';
import PromiseFinally from 'promise.prototype.finally';
import { isDevelop, isInMobileDevice } from '@/utils/environment';
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
PromiseFinally.shim();

if (window.location.protocol === 'https:' && navigator.serviceWorker) {
  // window.navigator.serviceWorker.getRegistrations().then((registrations) => {
  //   registrations.forEach((registration) => {
  //     registration.unregister();
  //   });
  // });
  navigator.serviceWorker.register(`${process.env.PUBLIC_PATH}service-worker.js`);
}

if (isDevelop(true)) {
  const el = document.createElement('div');
  import('eruda').then(({ default: eruda }) => {
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
