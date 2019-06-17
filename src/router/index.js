/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import Vue from 'vue';
import VueRouter from 'vue-router';
import get from 'lodash/get';
import { AUTH_STATE } from '@/config';
import { concatPath, compareVersion } from '@/utils/util';
import { routeClone, routeEquals } from '@/utils/navigation';
import { isInWechatMobile, supportsPushState, isInAppleWebkit, getAppleWebkitVersion, isIniOS } from '@/utils/environment';
import store from '@/store';
import { COMMON } from '@/store/types';
import { setHeaderTitle, setWechatShare, showDialog } from '@/store/utils';
import { checkAuthorizeRedirect } from '@/utils/authorization';
import ProgressBar from '@/components/progressbar';

// Module Route
import indexRoute from './modules';
import popupRoute from './modules/popup';
import userRoute from './modules/user';

const state = {
  // remember entry location info for auto convert
  entryHash: window.location.hash.substr(1),
  entryPath: window.location.pathname,
  entrySearch: window.location.search,
  routerMode: process.env.ROUTER_MODE || (isInWechatMobile() ? 'hash' : 'history'),

  // auto switch router mode between hash and history mode
  autoHashHistory: true,
  // auto redirect to index page when loading failed
  autoNavIndex: true,
  // auto push index route if route contains share info
  autoPushIndexRoute: true,

  // current states
  firstRouting: true,
  firstResolving: true,
  pushingIndexRoute: false,
};

// must before router instance initial
const onHistoryNav = () => {
  store.commit(`common/route/${COMMON.ROUTE_HISTORY_MODE}`);
};
window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', onHistoryNav);

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

Vue.use(VueRouter);
const routes = [].concat(
  popupRoute, userRoute,
  indexRoute, // this one must be the last one
);

const router = new VueRouter({
  base: process.env.PUBLIC_PATH,
  // base: __dirname,
  // base: 'test',
  routes,
  mode: state.routerMode,
  scrollBehavior: (to, from) => (routeEquals(to, from)
    ? null
    : {
      x: 0,
      y: store.state.common.scrolls[to.fullPath.replace(/\?.*$/u, '')] || 0,
    }),
});

const restoreScrollPos = () => {
  const to = store.state.common.route.to;
  if (to && store.state.common.scrolls[to.fullPath.replace(/\?.*$/u, '')]) {
    window.scrollTo(0, store.state.common.scrolls[to.fullPath.replace(/\?.*$/u, '')]);
  }
};
window.addEventListener('popstate', () => {
  const onScroll = () => {
    window.removeEventListener('scroll', onScroll);
    restoreScrollPos();
  };
  window.addEventListener('scroll', onScroll);
});
window.addEventListener('hashchange', () => {
  setWechatShare();
  restoreScrollPos();
});

router.beforeResolve((to, from, next) => {
  if (state.pushingIndexRoute) {
    const route = state.pushingIndexRoute;
    state.pushingIndexRoute = false;
    router.push(route);
    return;
  }
  const firstResolving = state.firstResolving;
  state.firstResolving = false;
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => {
    if (diffed) {
      return true;
    }
    if (prevMatched[i] !== c) {
      diffed = true;
    }
    return diffed;
  });

  // Deal with async data of current component.
  const success = () => {
    bar.finish();
    next();
    if (to.name !== from.name) {
      setHeaderTitle({
        route: to,
        title: store.state.common.navbarTitleCache[to.fullPath] || to.meta.title,
      });
      setWechatShare();
    }
  };
  const asyncDataHooks = activated.map(c => (c.extendOptions ? c.extendOptions.asyncData : c.asyncData)).filter(_ => _);
  if (asyncDataHooks.length) {
    const promises = asyncDataHooks.map(hook => hook({ store, route: to, router }));
    const failure = (err) => {
      const ignore = get(err, 'message') === 'REDIRECT' || get(err, 'response.errcode') === AUTH_STATE.GUEST;
      if (!ignore) {
        console.error(err);
      }
      bar.abort();
      next(false);
      if (!ignore && firstResolving) {
        if (state.autoNavIndex) {
          state.autoNavIndex = false;
          router.push({ name: 'index' });
        } else {
          showDialog({
            type: 'error',
            title: 'Unknown Error',
            content: 'Loading failed!',
          });
        }
      }
    };
    Promise.all(promises).then(success).catch(failure);
  } else {
    success();
  }
});

router.beforeEach(async (to, from, next) => {
  let redirect;
  // Auto switch between hash mode and history mode.
  if (!redirect && state.autoHashHistory) {
    if (router.mode === 'hash' && state.entryHash.length === 0) {
      const fullPath = state.entryPath.indexOf(process.env.PUBLIC_PATH) === 0
        ? concatPath('/', state.entryPath.substr(process.env.PUBLIC_PATH.length))
        : null;
      // if (state.entryPath !== rootPath) {
      //   window.history.replaceState({}, '', rootPath);
      // }
      if (fullPath && fullPath !== (state.entryHash || '/')) redirect = { path: `${fullPath}${state.entrySearch}` };
    } else if (router.mode === 'history') {
      const fullPath = state.entryHash.indexOf(process.env.PUBLIC_PATH) === 0
        ? concatPath('/', state.entryHash.substr(process.env.PUBLIC_PATH.length))
        : null;
      window.location.hash = '';
      if (fullPath && fullPath !== (state.entryPath || '/')) redirect = { path: fullPath };
    }
    if (redirect && isIniOS() && isInAppleWebkit() && compareVersion(getAppleWebkitVersion(), '602') < 0) {
      redirect = router.mode === 'hash'
        ? concatPath('/', process.env.PUBLIC_PATH, '#', redirect.path)
        : concatPath('/', process.env.PUBLIC_PATH, redirect.path);
    }
    state.autoHashHistory = false;
  }
  // Login logic.
  if (!redirect) {
    // Save scroll for current page
    store.commit(`common/${COMMON.SAVE_SCROLL}`, {
      scroll: window.scrollY,
      fullPath: from.fullPath,
    });
    store.commit(`common/route/${COMMON.ROUTE_BEFORE_CHANGE}`, { from, to });
    // Check auth requirement
    redirect = await checkAuthorizeRedirect(to);
  }
  // Auto push index when this is first page and is shared page.
  if (!redirect && state.autoPushIndexRoute) {
    if (to.query.__from_uid) { // eslint-disable-line no-underscore-dangle
      const route = routeClone(to);
      delete route.query.__from_uid; // eslint-disable-line no-underscore-dangle
      state.pushingIndexRoute = route;
      redirect = { name: 'index' };
    }
    state.autoPushIndexRoute = false;
  }
  // Process route.
  if (typeof redirect === 'string') {
    window.location = redirect;
  } else {
    if (!redirect) {
      store.commit(`common/route/${COMMON.ROUTE_CHANGE}`, { from, to });
    }
    if (state.firstRouting) {
      state.firstRouting = false;
      if (redirect) {
        next(false);
        router.replace(redirect);
        return;
      }
    }
    if (from.name && to.matched.some(record => record.meta.progressBar)) {
      bar.start();
    }
    next(redirect);
  }
});

// router.afterEach((route) => {
// });

router.onError((errMsg) => {
  if ((/Loading chunk \d+ failed\./u).test(errMsg)) {
    window.location.reload();
  } else {
    console.error(errMsg);
  }
});

export default router;
