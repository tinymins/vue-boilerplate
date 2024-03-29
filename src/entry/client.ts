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
import '@/fonts/fa-i/index.scss';
import '@/styles/index.scss';

import { FastClick } from 'fastclick';

import { type EntryParams } from '@/types';
import { PUBLIC_PATH } from '@/config';
import { getColorTheme, getRouterMode, isInBrowser, isInDevMode, isInMobileDevice } from '@/utils/environment';
import { concatPath } from '@/utils/util';
import { COMMON } from '@/store/common';
import createVue from '@/global/create-vue';
import createWedge from '@/global/create-wedge';
import flexible from '@/global/flexible';

const main = () => {
  let redirect;

  // Auto switch between hash mode and history mode.
  if (isInBrowser() && process.env.ROUTER_MODE === 'auto') {
    const publicPath = PUBLIC_PATH;
    const routerMode = getRouterMode(window.navigator.userAgent);
    const hash = concatPath('/', window.location.hash.slice(1));
    const hashPath = hash.replace(/\?.*/ug, '');
    const hashQuery = hash.slice(hashPath.length);
    const randomQuery = window.location.search.replace(/.*[&?](_=[^&]*).*?$/ug, '$1');
    const historyQuery = window.location.search.replace(randomQuery, '').replace(/[?&=]/ug, '')
      ? window.location.search.replace(randomQuery, '')
      : '';
    const historyPath = window.location.pathname.indexOf(publicPath) === 0
      ? concatPath('/', window.location.pathname.slice(publicPath.length))
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

    if (window.navigator.userAgent.includes('iPad')) {
      FastClick.attach(document.body);
    }

    if (window.location.protocol === 'https:' && navigator.serviceWorker) {
      /*
       * window.navigator.serviceWorker.getRegistrations().then((registrations) => {
       *   registrations.forEach((registration) => {
       *     registration.unregister();
       *   });
       * });
       */
      navigator.serviceWorker.register(`${PUBLIC_PATH}service-worker.js`);
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
      const { store, router, api } = createWedge(entryParams);
      if (window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__);
      }
      store.commit(`common/app/${COMMON.STORE_INSTANCE}`, store);
      store.commit(`common/app/${COMMON.API_INSTANCE}`, { api });
      store.commit(`common/app/${COMMON.ROUTER_INSTANCE}`, router);
      store.commit(`common/app/${COMMON.ENTRY_PARAMS}`, entryParams);
      createVue(store, router);
    };

    if (isInDevMode('manually')) {
      const el = document.createElement('div');
      import('eruda')
        .then((eruda) => {
          eruda.default.init({
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
          return eruda;
        })
        .catch((error: unknown) => { throw error; });
      document.body.append(el);
    } else {
      mountApp();
    }
  }
};

main();
