/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import * as api from '@/store/api/common';
import store from '@/store';
import { COMMON } from '@/store/types';
import { setWechatTitle } from '@/utils/util';
import { setWechatShare } from '@/utils/share';
import { isInWechatMobile, isInWechatDesktop, isInMobileDevice, isInApp } from '@/utils/environment';
import routeModule from './route';

const updateAutoHeightStyle = (autoHeight) => {
  const height = autoHeight ? null : '100%';
  document.body.style.height = height;
  document.documentElement.style.height = height;
};

const updateBackgroundStyle = (background) => {
  document.body.style.background = background;
  document.documentElement.style.background = background;
};

export default {
  namespaced: true,
  modules: {
    route: routeModule,
  },
  state: {
    loading: null,
    loadings: [],
    toast: null,
    toasts: [],
    message: null,
    messages: [],
    actionsheet: null,
    actionsheets: [],
    scrolls: {},
    bodyScrollable: true,
    bodyScrollables: [],
    bodyAutoHeight: true,
    bodyAutoHeights: [],
    bodyBackground: null,
    bodyBackgrounds: [],
    navbarTitle: '',
    navbarTitleCache: {},
    navbarHeight: 0,
    navbarVisibles: [],
    navbarVisible: (isInMobileDevice() && !isInWechatMobile() && !isInApp()) || isInWechatDesktop(),
    headerExtraHeight: 0,
    tabbarHeight: 0,
    tabbarVisibles: [],
    tabbarVisible: true,
    footerExtraHeight: 0,
    viewportTop: 0,
    viewportBottom: 0,
    viewportLeft: 0,
    viewportRight: 0,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    wechatSDKInfo: {},
  },
  getters: {
    headerHeight: state => (state.navbarVisible ? state.navbarHeight : 0) + state.headerExtraHeight + state.viewportTop,
    footerHeight: state => (state.tabbarVisible ? state.tabbarHeight : 0) + state.footerExtraHeight + state.viewportBottom,
    mainViewportHeight: state => state.viewportHeight
      - state.navbarHeight - state.headerExtraHeight - state.viewportTop
      - state.tabbarHeight - state.footerExtraHeight - state.viewportBottom,
    mainViewportWidth: state => state.viewportWidth - state.viewportLeft - state.viewportRight,
  },
  actions: {
    [COMMON.GET_WECHAT_SDK_INFO]({ state, commit }, params) {
      params.url = params.url.replace(/#.*$/, '');
      if (!state.wechatSDKInfo[params.url]) {
        return new Promise((resolve) => {
          api.getWechatSDKInfo(params.url).then((res) => {
            commit(COMMON.GET_WECHAT_SDK_INFO, {
              url: params.url,
              info: res.data.data,
            });
            resolve(res.data.data);
          });
        });
      }
      return Promise.resolve(state.wechatSDKInfo[params.url]);
    },
  },
  mutations: {
    [COMMON.SHOW_LOADING](state, { id, text }) {
      if (typeof id === 'number' || typeof id === 'string' || typeof id === 'symbol') {
        const loading = { id, text };
        if (state.loading) {
          state.loadings.push(state.loading);
        }
        state.loading = loading;
      } else {
        console.error('Require id to be set as number or sring or symbol!', { id, text });
      }
    },
    [COMMON.HIDE_LOADING](state, { id }) {
      state.loadings = state.loadings.filter(p => p.id !== id);
      if (state.loading && state.loading.id === id) {
        state.loading = state.loadings.length === 0
          ? null : state.loadings[state.loadings.length - 1];
      }
    },
    [COMMON.PUSH_TOAST](state, {
      text,
      time = 2000,
      type = 'warn',
      position = 'top',
      width = '300px',
    }) {
      const toast = { text, time, type, position, width };
      if (state.toast) {
        state.toasts.push(toast);
      } else {
        state.toast = toast;
      }
    },
    [COMMON.POP_TOAST](state) {
      if (state.toasts.length !== 0) {
        state.toast = state.toasts.shift();
      } else if (state.toast) {
        state.toast = null;
      }
    },
    [COMMON.PUSH_MESSAGE](state, { title, content }) {
      const message = { title, content };
      if (state.message) {
        state.messages.push(message);
      } else {
        state.message = message;
      }
    },
    [COMMON.POP_MESSAGE](state) {
      if (state.messages.length !== 0) {
        state.message = state.messages.shift();
      } else if (state.message) {
        state.message = null;
      }
    },
    [COMMON.PUSH_ACTIONSHEET](state, { title, data, handler }) {
      const actionsheet = { title, data, handler };
      if (state.actionsheet) {
        state.actionsheets.push(actionsheet);
      } else {
        state.actionsheet = actionsheet;
      }
    },
    [COMMON.POP_ACTIONSHEET](state) {
      if (state.actionsheets.length !== 0) {
        state.actionsheet = state.actionsheets.shift();
      } else if (state.actionsheet) {
        state.actionsheet = null;
      }
    },
    [COMMON.SAVE_SCROLL](state, { fullPath, scroll = null }) {
      if (scroll === null) {
        delete state.scrolls[fullPath];
      } else {
        state.scrolls[fullPath] = scroll;
      }
    },
    [COMMON.SET_BODY_SCROLLABLE](state, scrollable) {
      state.bodyScrollables.push(state.bodyScrollable);
      if (state.bodyScrollable && !scrollable) {
        document.body.style.overflow = 'hidden';
      } else if (!state.bodyScrollable && scrollable) {
        document.body.style.removeProperty('overflow');
      }
      state.bodyScrollable = scrollable;
    },
    [COMMON.REVERT_BODY_SCROLLABLE](state) {
      const scrollable = state.bodyScrollables.pop();
      if (state.bodyScrollable && !scrollable) {
        document.body.style.overflow = 'hidden';
      } else if (!state.bodyScrollable && scrollable) {
        document.body.style.removeProperty('overflow');
      }
      state.bodyScrollable = scrollable;
    },
    [COMMON.SET_BODY_AUTO_HEIGHT](state, autoHeight) {
      state.bodyAutoHeights.push(state.bodyAutoHeight);
      state.bodyAutoHeight = autoHeight;
      updateAutoHeightStyle(state.bodyAutoHeight);
    },
    [COMMON.REVERT_BODY_AUTO_HEIGHT](state) {
      state.bodyAutoHeight = state.bodyAutoHeights.pop();
      updateAutoHeightStyle(state.bodyAutoHeight);
    },
    [COMMON.SET_BODY_BACKGROUND](state, background) {
      state.bodyBackgrounds.push(state.bodyBackground);
      state.bodyBackground = background;
      updateBackgroundStyle(state.bodyBackground);
    },
    [COMMON.REVERT_BODY_BACKGROUND](state) {
      state.bodyBackground = state.bodyBackgrounds.pop();
      updateBackgroundStyle(state.bodyBackground);
    },
    [COMMON.SET_WECHAT_SHARE](state, share) {
      if (share) {
        setWechatShare(share);
      }
      state.wechatShare = share;
    },
    [COMMON.SET_HEADER_TITLE](state, params) {
      const { route, title } = Object.assign(
        { route: store.state.common.route.current, title: '' },
        typeof params === 'object' ? params : { title: params },
      );
      if (!state.wechatShare) {
        setWechatShare({ title, desc: '' });
      }
      setWechatTitle(title);
      state.navbarTitle = title || '';
      state.navbarTitleCache[route.fullPath] = state.navbarTitle;
    },
    [COMMON.SET_HEADER_HEIGHT](state, height) {
      state.navbarHeight = height;
    },
    [COMMON.SET_NAVBAR_VISIBLE](state, visible) {
      state.navbarVisibles.push(state.navbarVisible);
      state.navbarVisible = visible;
    },
    [COMMON.REVERT_NAVBAR_VISIBLE](state) {
      state.navbarVisible = state.navbarVisibles.pop();
    },
    [COMMON.SET_TABBAR_HEIGHT](state, height) {
      state.tabbarHeight = height;
    },
    [COMMON.SET_TABBAR_VISIBLE](state, visible) {
      state.tabbarVisibles.push(state.tabbarVisible);
      state.tabbarVisible = visible;
    },
    [COMMON.REVERT_TABBAR_VISIBLE](state) {
      state.tabbarVisible = state.tabbarVisibles.pop() !== false;
    },
    [COMMON.OFFSET_HEADER_HEIGHT](state, offset) {
      state.headerExtraHeight += offset;
    },
    [COMMON.OFFSET_FOOTER_HEIGHT](state, offset) {
      state.footerExtraHeight += offset;
    },
    [COMMON.SET_VIEWPORT_SIZE](state, { top = 0, bottom = 0, left = 0, right = 0, width, height }) {
      state.viewportTop = top;
      state.viewportBottom = bottom;
      state.viewportLeft = left;
      state.viewportRight = right;
      state.viewportWidth = width;
      state.viewportHeight = height;
    },
    [COMMON.GET_SHARES_INVITE_INFO](state, data) {
      state.sharesInviteInfo = data;
    },
    [COMMON.GET_WECHAT_SDK_INFO](state, { url, info }) {
      state.wechatSDKInfo[url] = info;
    },
  },
};
