/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import * as api from '@/api/common';
import store from '@/store';
import { COMMON } from '@/store/types';
import { setWechatTitle } from '@/utils/util';
import { setWechatShare } from '@/utils/wechat';
import { isInWechatMobile, isInWechatDesktop, isInMobileDevice, isInApp } from '@/utils/environment';
import routeModule from './route';

const updateScrollableStyle = (scrollables) => {
  const scrollable = scrollables.length
    ? scrollables[scrollables.length - 1].value
    : true;
  if (scrollable) {
    document.body.style.removeProperty('overflow');
  } else {
    document.body.style.overflow = 'hidden';
  }
};

const updateAutoHeightStyle = (autoHeights) => {
  const autoHeight = autoHeights.length
    ? autoHeights[autoHeights.length - 1].value
    : true;
  const height = autoHeight ? null : '100%';
  document.body.style.height = height;
  document.documentElement.style.height = height;
};

const updateBackgroundStyle = (backgrounds) => {
  const background = backgrounds.length
    ? backgrounds[backgrounds.length - 1].value
    : null;
  document.body.style.background = background;
  document.documentElement.style.background = background;
};

const sorterDescending = (a, b) => {
  if (a.index === b.index) {
    return 0;
  }
  return a.index > b.index ? 1 : -1;
};

const show = (type, list, data) => {
  if (!data) {
    throw new Error(`show ${type} missing param!`);
  }
  if (!data.id) {
    throw new Error(`show ${type} missing id in param!`);
  }
  const item = Object.assign({}, data);
  list.push(item);
};

const hide = (list, id) => {
  if (id) {
    return list.filter(p => p.id !== id);
  }
  return list.filter((p, i) => i !== 0);
};

export default {
  namespaced: true,
  modules: {
    route: routeModule,
  },
  state: {
    loadings: [],
    toasts: [],
    dialogs: [],
    actionsheets: [],
    pickers: [],
    scrolls: {},
    bodyScrollables: [],
    bodyAutoHeights: [],
    bodyBackgrounds: [],
    navbarTitle: '',
    navbarTitleCache: {},
    navbarHeight: 0,
    navbarVisibles: [],
    headerExtraHeights: [],
    tabbarHeight: 0,
    tabbarVisibles: [],
    footerExtraHeights: [],
    viewportTop: 0,
    viewportBottom: 0,
    viewportLeft: 0,
    viewportRight: 0,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    wechatSDKInfo: {},
  },
  getters: {
    navbarVisible: (state) => {
      const visible = state.navbarVisibles.length
        ? state.navbarVisibles[state.navbarVisibles.length - 1].value
        : (isInMobileDevice() && !isInWechatMobile() && !isInApp()) || isInWechatDesktop();
      return visible;
    },
    tabbarVisible: (state) => {
      const length = state.tabbarVisibles.length;
      return length ? state.tabbarVisibles[length - 1].value : true;
    },
    headerHeights: (state, getters) => {
      const headerHeights = [];
      const navbarHeight = getters.navbarVisible ? state.navbarHeight : 0;
      let headerExtraHeight = 0;
      state.headerExtraHeights.forEach((p) => {
        headerHeights.push({
          id: p.id,
          height: navbarHeight + headerExtraHeight + state.viewportTop,
        });
        headerExtraHeight += p.height;
      });
      return headerHeights;
    },
    headerHeight: (state, getters) => {
      const navbarHeight = getters.navbarVisible ? state.navbarHeight : 0;
      let headerExtraHeight = 0;
      state.headerExtraHeights.forEach((p) => {
        headerExtraHeight += p.height;
      });
      return navbarHeight + headerExtraHeight + state.viewportTop;
    },
    footerHeights: (state, getters) => {
      const footerHeights = [];
      const tabbarHeight = getters.tabbarVisible ? state.tabbarHeight : 0;
      let footerExtraHeight = 0;
      state.footerExtraHeights.forEach((p) => {
        footerHeights.push({
          id: p.id,
          height: tabbarHeight + footerExtraHeight + state.viewportBottom,
        });
        footerExtraHeight += p.height;
      });
      return footerHeights;
    },
    footerHeight: (state, getters) => {
      const tabbarHeight = getters.tabbarVisible ? state.tabbarHeight : 0;
      let footerExtraHeight = 0;
      state.footerExtraHeights.forEach((p) => {
        footerExtraHeight += p.height;
      });
      return tabbarHeight + footerExtraHeight + state.viewportBottom;
    },
    mainViewportHeight: (state, getters) => state.viewportHeight
      - (getters.navbarVisible ? state.navbarHeight : 0) - getters.headerHeight
      - (getters.tabbarVisible ? state.tabbarHeight : 0) - getters.footerHeight,
    mainViewportWidth: state => state.viewportWidth - state.viewportLeft - state.viewportRight,
  },
  actions: {
    [COMMON.GET_WECHAT_SDK_INFO]({ state, commit }, params) {
      params.url = params.url.replace(/#.*$/u, '');
      if (!state.wechatSDKInfo[params.url]) {
        return new Promise((resolve) => {
          api.getWechatSDKInfo(params.url).then((res) => {
            commit(COMMON.GET_WECHAT_SDK_INFO, {
              url: params.url,
              info: res.data,
            });
            resolve(res.data);
          });
        });
      }
      return Promise.resolve(state.wechatSDKInfo[params.url]);
    },
  },
  mutations: {
    [COMMON.SHOW_LOADING](state, { id, text }) {
      show('loading', state.loadings, { id, text });
    },
    [COMMON.HIDE_LOADING](state, { id, action } = {}) {
      if (action === 'clear') {
        state.loadings = [];
      } else {
        state.loadings = hide(state.loadings, id);
      }
    },
    [COMMON.SHOW_TOAST](state, {
      id,
      text,
      time = 2000,
      type = 'warn',
      position = 'top',
      width = '300px',
    }) {
      show('toast', state.toasts, { id, text, time, type, position, width });
    },
    [COMMON.HIDE_TOAST](state, { id, action } = {}) {
      if (action === 'clear') {
        state.toasts = [];
      } else {
        state.toasts = hide(state.toasts, id);
      }
    },
    [COMMON.SHOW_DIALOG](state, { id, type, title, content, onclose, buttons = [] }) {
      show('dialog', state.dialogs, { id, type, title, content, onclose, buttons });
    },
    [COMMON.HIDE_DIALOG](state, { id, action } = {}) {
      if (action === 'clear') {
        state.dialogs = [];
      } else {
        state.dialogs = hide(state.dialogs, id);
      }
    },
    [COMMON.SHOW_ACTIONSHEET](state, { id, title, data, handler }) {
      show('actionsheet', state.actionsheets, { id, title, data, handler });
    },
    [COMMON.HIDE_ACTIONSHEET](state, { id, action } = {}) {
      if (action === 'clear') {
        state.actionsheets = [];
      } else {
        state.actionsheets = hide(state.actionsheets, id);
      }
    },
    [COMMON.SHOW_PICKER](state, { id, title, data, value, handler }) {
      show('picker', state.pickers, { id, title, data, value, handler });
    },
    [COMMON.HIDE_PICKER](state, { id, action } = {}) {
      if (action === 'clear') {
        state.pickers = [];
      } else {
        state.pickers = hide(state.pickers, id);
      }
    },
    [COMMON.SAVE_SCROLL](state, { fullPath, scroll = null }) {
      if (scroll === null) {
        delete state.scrolls[fullPath.replace(/\?.*$/u, '')];
      } else {
        state.scrolls[fullPath.replace(/\?.*$/u, '')] = scroll;
      }
    },
    [COMMON.SET_BODY_SCROLLABLE](state, { id, value }) {
      state.bodyScrollables = state.bodyScrollables
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      updateScrollableStyle(state.bodyScrollables);
    },
    [COMMON.REMOVE_BODY_SCROLLABLE](state, { id }) {
      state.bodyScrollables = state.bodyScrollables
        .filter(p => p.id !== id);
      updateScrollableStyle(state.bodyScrollables);
    },
    [COMMON.SET_BODY_AUTO_HEIGHT](state, { id, value }) {
      state.bodyAutoHeights = state.bodyAutoHeights
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      updateAutoHeightStyle(state.bodyAutoHeights);
    },
    [COMMON.REMOVE_BODY_AUTO_HEIGHT](state, { id }) {
      state.bodyAutoHeights = state.bodyAutoHeights
        .filter(p => p.id !== id);
      updateAutoHeightStyle(state.bodyAutoHeights);
    },
    [COMMON.SET_BODY_BACKGROUND](state, { id, value }) {
      state.bodyBackgrounds = state.bodyBackgrounds
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      updateBackgroundStyle(state.bodyBackgrounds);
    },
    [COMMON.REMOVE_BODY_BACKGROUND](state, { id }) {
      state.bodyBackgrounds = state.bodyBackgrounds
        .filter(p => p.id !== id);
      updateBackgroundStyle(state.bodyBackgrounds);
    },
    [COMMON.SET_WECHAT_SHARE](state, share) {
      setWechatShare(share);
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
    [COMMON.SET_NAVBAR_VISIBLE](state, { id, value }) {
      state.navbarVisibles = state.navbarVisibles
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
    },
    [COMMON.REMOVE_NAVBAR_VISIBLE](state, { id }) {
      state.navbarVisibles = state.navbarVisibles
        .filter(p => p.id !== id);
    },
    [COMMON.SET_TABBAR_HEIGHT](state, height) {
      state.tabbarHeight = height;
    },
    [COMMON.SET_TABBAR_VISIBLE](state, { id, value }) {
      state.tabbarVisibles = state.tabbarVisibles
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
    },
    [COMMON.REMOVE_TABBAR_VISIBLE](state, { id }) {
      state.tabbarVisibles = state.tabbarVisibles
        .filter(p => p.id !== id);
    },
    [COMMON.SET_HEADER_EXTRA_HEIGHT](state, { id, index = 0, height: oriHeight }) {
      const height = parseFloat(oriHeight) || 0;
      const headerExtraHeights = state.headerExtraHeights;
      const i = headerExtraHeights.findIndex(p => p.id === id);
      if (i >= 0) {
        headerExtraHeights[i].index = index;
        headerExtraHeights[i].height = height;
      } else {
        headerExtraHeights.push({ id, index, height });
      }
      state.headerExtraHeights = headerExtraHeights.sort(sorterDescending);
    },
    [COMMON.REMOVE_HEADER_EXTRA_HEIGHT](state, { id }) {
      state.headerExtraHeights = state.headerExtraHeights.filter(p => p.id !== id);
    },
    [COMMON.SET_FOOTER_EXTRA_HEIGHT](state, { id, index = 0, height: oriHeight }) {
      const height = parseFloat(oriHeight) || 0;
      const footerExtraHeights = state.footerExtraHeights;
      const i = footerExtraHeights.findIndex(p => p.id === id);
      if (i >= 0) {
        footerExtraHeights[i].index = index;
        footerExtraHeights[i].height = height;
      } else {
        footerExtraHeights.push({ id, index, height });
      }
      state.footerExtraHeights = footerExtraHeights.sort(sorterDescending);
    },
    [COMMON.REMOVE_FOOTER_EXTRA_HEIGHT](state, { id }) {
      state.footerExtraHeights = state.footerExtraHeights.filter(p => p.id !== id);
    },
    [COMMON.SET_VIEWPORT_SIZE](state, { top = 0, bottom = 0, left = 0, right = 0, width, height }) {
      state.viewportTop = top;
      state.viewportBottom = bottom;
      state.viewportLeft = left;
      state.viewportRight = right;
      state.viewportWidth = width;
      state.viewportHeight = height;
    },
  },
};
