/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import Vue from 'vue';
import VueRouter from 'vue-router';
import { routeClone, routeEquals, concatPath, compareVersion } from '@/utils/util';
import { isDevelop, isLocalhost, isInWechat, isInWechatMobile,
  supportsPushState, isInAppleWebkit, getAppleWebkitVersion } from '@/utils/environment';
// Module Route
import indexRoute from '@/router/basic/index';
import popupRoute from '@/router/basic/popup';
import msgRoute from '@/router/basic/msg';
import secretRoute from '@/router/basic/secret';
import userRoute from '@/router/basic/user';
import store from '@/store';
import { getAuthorization, getAuthorizeURL } from '@/utils/authorization';
import ProgressBar from '@/components/progressbar';
import { BASE_ROUTE, CHROME_EXTENSION } from '@/config/environment';

const state = {
  // remember entry location info for auto convert
  entryHash: window.location.hash,
  entryPath: window.location.pathname,
  entrySearch: window.location.search,
  routerMode: (isInWechatMobile() || CHROME_EXTENSION) ? 'hash' : 'history',

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
  store.commit('common/route/COMMON_ROUTE_HISTORY_MODE');
};
window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', onHistoryNav);

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

Vue.use(VueRouter);
const routes = [].concat(
  popupRoute, msgRoute, secretRoute, userRoute,
  indexRoute,
);

const router = new VueRouter({
  base: BASE_ROUTE,
  // base: __dirname,
  // base: 'test',
  routes,
  mode: state.routerMode,
  scrollBehavior: (to, from) => (routeEquals(to, from) ? null : {
    x: 0,
    y: to.query.reload ? 0 : store.state.common.scrolls[to.fullPath] || 0,
  }),
});

const restoreScrollPos = () => {
  const from = store.state.common.route.from;
  if (from && store.state.common.scrolls[from.fullPath]) {
    window.scrollTo(0, store.state.common.scrolls[from.fullPath]);
  }
};
window.addEventListener('popstate', () => {
  const onScroll = () => {
    window.removeEventListener('scroll', onScroll);
    restoreScrollPos();
  };
  window.addEventListener('scroll', onScroll);
});
window.addEventListener('hashchange', restoreScrollPos);

router.beforeResolve((to, from, next) => {
  if (state.pushingIndexRoute) {
    return;
  }
  const firstResolving = state.firstResolving;
  state.firstResolving = false;
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));

  // Deal with async data of current component.
  const success = () => {
    bar.finish();
    next();
    if (to.name !== from.name) {
      store.commit(
        'common/COMMON_SET_HEADER_TITLE', {
          route: to,
          title: store.state.common.navbarTitleCache[to.fullPath] || to.meta.title,
        },
      );
    }
  };
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
  if (!asyncDataHooks.length) {
    success();
  } else {
    const promises = asyncDataHooks.map(hook => hook({ store, route: to, router }));
    const failure = (err) => {
      const ignore = !err || err.message === 'REDIRECT' || (
        err.response && err.response.data && err.response.data.errcode === 401
      );
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
          Vue.pushMessage({
            type: 'error',
            title: 'Unknown Error',
            content: 'Loading failed!',
          });
        }
      }
    };
    Promise.all(promises).then(success).catch(failure);
  }
});

router.beforeEach(async (to, from, next) => {
  let redirect;
  // Auto switch between hash mode and history mode.
  if (!redirect && state.autoHashHistory) {
    if (router.mode === 'hash' && state.entryHash.length <= 1) {
      const fullPath = state.entryPath.indexOf(BASE_ROUTE) === 0
        ? concatPath('/', state.entryPath.substr(BASE_ROUTE.length)) : null;
      // if (state.entryPath !== rootPath) {
      //   window.history.replaceState({}, '', rootPath);
      // }
      if (fullPath && fullPath !== (state.entryHash || '/')) redirect = { path: `${fullPath}${state.entrySearch}` };
    } else if (router.mode === 'history') {
      const fullPath = state.entryHash.indexOf(BASE_ROUTE) === 1
        ? concatPath('/', state.entryHash.substr(BASE_ROUTE.length + 1)) : null;
      window.location.hash = '';
      if (fullPath && fullPath !== (state.entryPath || '/')) redirect = { path: fullPath };
    }
    if (redirect && isInAppleWebkit() && compareVersion(getAppleWebkitVersion(), '602') < 0) {
      redirect = router.mode === 'hash'
        ? concatPath('/', BASE_ROUTE, '#', redirect.path)
        : concatPath('/', BASE_ROUTE, redirect.path);
    }
    state.autoHashHistory = false;
  }
  // Login logic.
  if (!redirect) {
    store.commit('common/COMMON_SAVE_SCROLL', {
      scroll: window.scrollY,
      fullPath: from.fullPath,
    });
    store.commit('common/route/COMMON_ROUTE_BEFORE_CHANGE', { from, to });
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
    const requiresDevelop = to.matched.some(record => record.meta.requiresDevelop);
    const useWechatAuth = !isLocalhost() && isInWechat() && getAuthorizeURL('wx', 'login');
    const status = (requiresAuth || requiresGuest || useWechatAuth) ? await getAuthorization() : null;
    if (requiresDevelop && !isDevelop()) {
      redirect = { name: 'index' };
    } else if (status === 448 && requiresAuth && to.name !== 'user_register') {
      redirect = { name: 'user_register' };
    } else if (status === 401 && (requiresAuth || useWechatAuth)) {
      if (useWechatAuth) {
        redirect = getAuthorizeURL('wx', 'login', to);
      } else {
        redirect = { name: 'user_login', query: { redirect: to.fullPath } };
      }
    } else if (status === 200 && to.query.redirect) {
      redirect = { path: to.query.redirect };
    } else if (status !== 401 && requiresGuest) {
      redirect = { name: 'secret' };
    } else if (status === 200 && to.name === 'user_register') {
      redirect = { name: 'secret' };
    }
  }
  // Auto push index when this is first page and is shared page.
  if (!redirect && state.autoPushIndexRoute) {
    if (to.query.__from_uid) {
      state.pushingIndexRoute = true;
      setTimeout(() => {
        state.pushingIndexRoute = false;
        const route = routeClone(to);
        delete route.query.__from_uid;
        router.push(route);
      }, 100);
      redirect = { name: 'index' };
    }
    state.autoPushIndexRoute = false;
  }
  // Process route.
  if (typeof redirect === 'string') {
    window.location = redirect;
  } else {
    if (!redirect) {
      store.commit('common/route/COMMON_ROUTE_CHANGE', { from, to });
    }
    if (state.firstRouting) {
      state.firstRouting = false;
      if (redirect) {
        next(false);
        router.replace(redirect);
        return;
      }
    }
    if (from.name && !to.matched.some(record => record.meta.progressBar === false)) {
      bar.start();
    }
    next(redirect);
  }
});

router.afterEach((route) => {
  if (route.query.reload) {
    const removeOnceParam = () => {
      const redirect = routeClone(route);
      delete redirect.query.reload;
      router.replace(redirect);
    };
    Vue.nextTick(removeOnceParam);
  }
});

router.onError((errMsg) => {
  if (/Loading chunk \d+ failed\./.test(errMsg)) {
    window.location.reload();
  } else {
    console.error(errMsg);
  }
});

export default router;
