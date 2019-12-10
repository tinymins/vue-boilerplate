/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of normal web-app build
 */

import '@babel/polyfill';
import FastClick from 'fastclick';
import { concatPath } from '@/utils/util';
import { isInDevMode, isInMobileDevice, isInBrowser, getRouterMode, getColorTheme } from '@/utils/environment';
import flexible from '@/global/flexible';
import mountVue from '@/global/mount-vue';
import '@/styles/index.scss';

let redirect;

// Auto switch between hash mode and history mode.
if (isInBrowser() && process.env.ROUTER_MODE === 'auto') {
  const publicPath = process.env.PUBLIC_PATH || '/';
  const routerMode = getRouterMode();
  const hash = concatPath('/', window.location.hash.substr(1));
  const hashPath = hash.replace(/\?.*/ug, '');
  const hashQuery = hash.substr(hashPath.length);
  const randomQuery = window.location.search.replace(/.*[&?](_=[^&]*).*?$/ug, '$1');
  const historyQuery = window.location.search.replace(randomQuery, '').replace(/[?&=]/ug, '')
    ? window.location.search.replace(randomQuery, '')
    : '';
  const historyPath = window.location.pathname.indexOf(publicPath) === 0
    ? concatPath('/', window.location.pathname.substr(publicPath.length))
    : '/';
  if (routerMode === 'hash' && hashPath === '/' && historyPath !== '/') {
    redirect = concatPath('/', publicPath, `#${historyPath}${historyQuery}`);
  } else if (routerMode === 'history' && historyPath.replace(/\?.*$/u, '') === '/' && hashPath !== '/') {
    redirect = concatPath('/', publicPath, `${hashPath}${hashQuery}`);
  }
  if (redirect) {
    window.location.href = redirect;
  }
}

if (redirect) {
  console.warn(`Redirecting to: ${redirect}`);
} else {
  if (isInMobileDevice()) {
    flexible();
    document.body.className = 'mobile';
    document.documentElement.className = 'mobile';
  } else {
    document.body.className = 'pc';
    document.documentElement.className = 'pc';
  }
  document.body.setAttribute('color-theme', getColorTheme());
  document.documentElement.setAttribute('color-theme', getColorTheme());

  if (window.navigator.userAgent.indexOf('iPad') > -1) {
    FastClick.attach(document.body);
  }

  if (window.location.protocol === 'https:' && navigator.serviceWorker) {
    // window.navigator.serviceWorker.getRegistrations().then((registrations) => {
    //   registrations.forEach((registration) => {
    //     registration.unregister();
    //   });
    // });
    navigator.serviceWorker.register(`${process.env.PUBLIC_PATH}service-worker.js`);
  }

  if (isInDevMode('manually')) {
    const el = document.createElement('div');
    import('eruda').then(({ default: eruda }) => {
      eruda.init({
        container: el,
        tool: [
          'snippets',
          'console',
          'elements',
          'network',
          'resource',
          'info',
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
}
