/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-01 13:44:21
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-13 17:30:58
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import Vue from 'vue';
import VueRouter from 'vue-router';
import { setWechatTitle, routeClone, routeEquals, concatPath, compareVersion } from '@/utils/util';
import { isDevelop, isLocalhost, isInWechat,
  supportsPushState, isInAppleWebkit, getAppleWebkitVersion } from '@/utils/environment';
// Module Route
import indexRoute from '@/router/basic/index';
import popupRoute from '@/router/basic/popup';
import msgRoute from '@/router/basic/msg';
import secretRoute from '@/router/basic/secret';
import userRoute from '@/router/basic/user';
import store from '@/store';
import { getAuthorization, getWechatLoginURL } from '@/utils/authorization';
import ProgressBar from '@/components/progressbar';
import { BASE_ROUTE, CHROME_EXTENSION } from '@/config/environment';

// remember entry location info for auto convert
let autoHashHistory = true;
const entryHash = window.location.hash;
const entryPath = window.location.pathname;
const entrySearch = window.location.search;
const routerMode = (isInWechat() || CHROME_EXTENSION) ? 'hash' : 'history';

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
  mode: routerMode,
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
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));

  // Deal with Vue.use() of current component.
  activated.map(c => c.uses).filter(_ => _).forEach((uses) => {
    Object.values(uses).forEach(entity => Vue.use(entity));
  });

  // Deal with async data of current component.
  const success = () => {
    bar.finish();
    next();
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
    };
    Promise.all(promises).then(success).catch(failure);
  }
});

router.beforeEach(async (to, from, next) => {
  let redirect, stopNext;
  if (autoHashHistory) {
    if (router.mode === 'hash' && entryHash.length <= 1) {
      const fullPath = entryPath.indexOf(BASE_ROUTE) === 0
        ? concatPath('/', entryPath.substr(BASE_ROUTE.length)) : null;
      // if (entryPath !== rootPath) {
      //   window.history.replaceState({}, '', rootPath);
      // }
      if (fullPath) redirect = { path: `${fullPath}${entrySearch}` };
    } else if (router.mode === 'history') {
      const fullPath = entryHash.indexOf(BASE_ROUTE) === 1
        ? concatPath('/', entryHash.substr(BASE_ROUTE.length + 1)) : null;
      window.location.hash = '';
      if (fullPath) redirect = { path: fullPath };
    }
    if (redirect && isInAppleWebkit() && compareVersion(getAppleWebkitVersion(), '602') < 0) {
      redirect = router.mode === 'hash'
        ? concatPath('/', BASE_ROUTE, '#', redirect.path)
        : concatPath('/', BASE_ROUTE, redirect.path);
    }
    stopNext = !!redirect;
    autoHashHistory = false;
  } else if (from.name && !to.matched.some(record => record.meta.progressBar === false)) {
    bar.start();
  }
  if (!redirect) {
    store.commit('common/COMMON_SAVE_SCROLL', {
      scroll: window.scrollY,
      fullPath: from.fullPath,
    });
    store.commit('common/route/COMMON_ROUTE_BEFORE_CHANGE', { from, to });
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
    const requiresDevelop = to.matched.some(record => record.meta.requiresDevelop);
    const useWechatAuth = !isLocalhost() && isInWechat() && getWechatLoginURL();
    const status = (requiresAuth || requiresGuest || useWechatAuth) ? await getAuthorization() : null;
    if (requiresDevelop && !isDevelop()) {
      redirect = { name: 'index' };
    } else if (status === 448 && requiresAuth && to.name !== 'user_register') {
      redirect = { name: 'user_register' };
    } else if (status === 401 && (requiresAuth || useWechatAuth)) {
      if (useWechatAuth) {
        redirect = getWechatLoginURL(to);
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
  if (typeof redirect === 'string') {
    window.location = redirect;
  } else {
    if (!redirect) {
      store.commit('common/route/COMMON_ROUTE_CHANGE', { from, to });
    }
    if (stopNext) {
      next(false);
      router.replace(redirect);
    } else next(redirect);
  }
});

router.afterEach((route) => {
  if (route.meta.title) {
    setWechatTitle(route.meta.title);
  }
  if (route.query.reload) {
    const removeOnceParam = () => {
      const redirect = routeClone(route);
      delete redirect.query.reload;
      router.replace(redirect);
    };
    Vue.nextTick(removeOnceParam);
  }
});
// router.onError((callback) => {
//   console.log(callback);
// });
//
export default router;
