/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of normal web-app build
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import FastClick from 'fastclick';
import { EntryParams } from '@/types';
import { COMMON } from '@/store/types';
import { concatPath } from '@/utils/util';
import { isInDevMode, isInMobileDevice, isInBrowser, getRouterMode, getColorTheme } from '@/utils/environment';
import flexible from '@/global/flexible';
import createWedge from '@/global/create-wedge';
import createVue from '@/global/create-vue';
import '@/fonts/fa-i/index.scss';
import '@/styles/index.scss';

let redirect;

// Auto switch between hash mode and history mode.
if (isInBrowser() && process.env.ROUTER_MODE === 'auto') {
  const publicPath = process.env.PUBLIC_PATH || '/';
  const routerMode = getRouterMode(window.navigator.userAgent);
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
  if (isInMobileDevice(window.navigator.userAgent)) {
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

  const mountApp = (): void => {
    const entryParams: EntryParams = {
      host: window.location.host,
      hostname: window.location.hostname,
      href: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      port: window.location.port,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent,
    };
    const { store, http, router } = createWedge(entryParams);
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__);
    }
    store.commit(`common/app/${COMMON.STORE_INSTANCE}`, store);
    store.commit(`common/app/${COMMON.HTTP_INSTANCE}`, http);
    store.commit(`common/app/${COMMON.ROUTER_INSTANCE}`, router);
    store.commit(`common/app/${COMMON.ENTRY_PARAMS}`, entryParams);
    const app = createVue(store, router);
    // 先挂上 第二次才轮到客户端
    app.$mount('#app');
  };

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
      mountApp();
    });
    document.body.appendChild(el);
  } else {
    mountApp();
  }
}
