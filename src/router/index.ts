/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import get from 'lodash/get';
import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import { EntryParams } from '@/types';
import { AUTH_STATE } from '@/config';
import { configWechatSDK } from '@/utils/connect';
import { routeClone, routeEquals, RouteInfo } from '@/utils/navigation';
import { isSupportPushState, getRouterMode } from '@/utils/environment';
import { StoreInstance } from '@/store';
import { COMMON } from '@/store/types';
import { setPageTitle, setPageShare, showDialog } from '@/store/utils';
import { checkAuthorizeRedirect } from '@/utils/authorization';
import Progressbar from '@/views/common/progressbar';

// 子模块路由
import indexRoute from './modules';
import userRoute from './modules/user';
import popupRoute from './modules/popup';

export type RouterInstance = VueRouter;
export interface AsyncDataParam {
  route: Route;
  store: StoreInstance;
  router: RouterInstance;
}
export type AsyncDataReturn = Promise<void | void[]>;
export type AsyncDataFunction = (p: AsyncDataParam) => AsyncDataReturn;

const createRouter = (store: StoreInstance, entryParams: EntryParams): VueRouter => {
  const state: {
    /** 加载出错时重定向到首页标记位 */
    autoNavIndex: boolean;
    /** 如果链接来自分享则自动在历史记录最前方插入首页 */
    autoPushIndexRoute: boolean;
    /** 第一次路由标记 */
    firstRouting: boolean;
    /** 第一次路由结束标记 */
    firstResolving: boolean;
    /** 插入首页路由成功后跳转返回的路由 */
    pushIndexReturnRoute?: RouteInfo;
  } = {
    autoNavIndex: true,
    autoPushIndexRoute: true,
    firstRouting: true,
    firstResolving: true,
    pushIndexReturnRoute: void 0,
  };

  // 必须在路由对象创建之前添加该事件监听
  const onHistoryNav = (): void => {
    store.commit(`common/route/${COMMON.ROUTE_HISTORY_MODE}`);
  };
  window.addEventListener(isSupportPushState(entryParams.userAgent) ? 'popstate' : 'hashchange', onHistoryNav);

  // 创建进度条组件
  const progressbar = new Vue<Progressbar>(Progressbar).$mount();
  Vue.prototype.$progressbar = progressbar;
  document.body.appendChild(progressbar.$el);

  // 创建并初始化路由
  Vue.use(VueRouter);
  const routes: RouteConfig[] = [];
  [
    userRoute,
    popupRoute,
    indexRoute, // 首页路由必须在最后面
  ].forEach(rs => rs.forEach(r => routes.push(r)));

  const router = new VueRouter({
    base: process.env.PUBLIC_PATH,
    // base: __dirname,
    // base: 'test',
    routes,
    mode: getRouterMode(entryParams.userAgent),
    scrollBehavior: (to, from) => (routeEquals(to, from)
      ? void 0
      : {
        x: 0,
        y: store.state.common.bus.scrolls[to.fullPath.replace(/\?.*$/u, '')] || 0,
      }),
  });

  // 用于解决浏览器行为(前进后退)导致地址变化触发路由切换时，页面滚动位置发生跳变影响体验的问题
  const restoreScrollPos = (): void => {
    const to = store.state.common.route.to;
    if (to && to.fullPath && store.state.common.bus.scrolls[to.fullPath.replace(/\?.*$/u, '')]) {
      window.scrollTo(0, store.state.common.bus.scrolls[to.fullPath.replace(/\?.*$/u, '')]);
    }
  };
  window.addEventListener('popstate', () => {
    const onScroll = (): void => {
      window.removeEventListener('scroll', onScroll);
      restoreScrollPos();
    };
    window.addEventListener('scroll', onScroll);
  });
  window.addEventListener('hashchange', () => {
    setPageShare(store);
    restoreScrollPos();
  });

  router.beforeResolve((to, from, next) => {
    if (state.pushIndexReturnRoute) {
      const route = state.pushIndexReturnRoute;
      state.pushIndexReturnRoute = void 0;
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

    // 处理目标路由所有 Vue 实例对象的 asyncData 函数
    const success = (): void => {
      progressbar.finish();
      next();
      if (to.name !== from.name) {
        setPageTitle(store, {
          route: routeClone(to),
          title: store.state.common.bus.navbarTitleCache[to.fullPath] || to.meta.title as string,
        });
        setPageShare(store);
      }
      configWechatSDK(store);
    };
    const asyncDataHooks: AsyncDataFunction[] = activated
      .map(c => get(c, 'extendOptions.asyncData') || get(c, 'asyncData'))
      .filter(_ => _);
    if (asyncDataHooks.length) {
      const promises = asyncDataHooks.map(hook => hook({ store, route: to, router }));
      const failure = (err): void => {
        const ignore = get(err, 'message') === 'REDIRECT' || get(err, 'response.errcode') === AUTH_STATE.GUEST;
        if (!ignore) {
          console.error(err);
        }
        progressbar.abort();
        next(false);
        if (err.type === 'REDIRECT' && err.redirect) {
          router.push(err.redirect);
        } else if (!ignore && firstResolving) {
          if (state.autoNavIndex) {
            state.autoNavIndex = false;
            router.push({ name: 'index' });
          } else {
            showDialog(store, {
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
    // 鉴权逻辑
    if (!redirect) {
      // 保存当前页面滚动位置
      store.commit(`common/bus/${COMMON.SAVE_SCROLL}`, {
        scroll: window.scrollY,
        fullPath: from.fullPath,
      });
      store.commit(`common/route/${COMMON.ROUTE_BEFORE_CHANGE}`, { from, to });
      // 检查登录权限是否符合目标路由要求
      redirect = await checkAuthorizeRedirect(store, to);
    }
    // 如果是第一次路由并且来自分享 则在前方插入首页路由
    if (!redirect && state.autoPushIndexRoute) {
      if (to.query.__from_uid) {
        const route = routeClone(to);
        delete route.query.__from_uid;
        state.pushIndexReturnRoute = route;
        redirect = { name: 'index', replace: true };
      }
      state.autoPushIndexRoute = false;
    }
    // 逻辑完成 应用路由状态
    if (typeof redirect === 'string') {
      window.location.href = redirect;
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
        progressbar.start();
      }
      next(redirect);
    }
  });

  // router.afterEach((route) => {
  // });

  router.onError((errMsg) => {
    if ((/Loading chunk \d+ failed\./u).test(errMsg.toString())) {
      window.location.reload();
    } else {
      console.error(errMsg);
    }
  });

  return router;
};

export default createRouter;
