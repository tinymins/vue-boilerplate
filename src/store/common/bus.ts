/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { UniqueID, BasicUniqueObject } from '@/types';
import store from '@/store';
import { COMMON } from '@/store/types';
import { getColorTheme, isInMobileDevice, isInWechat, isInEmbedded } from '@/utils/environment';
import { RouteInfo } from '@/utils/navigation';
import { setPageTitle, setPageShare, ShareData } from '@/utils/connect';
import { ToastData } from '@/views/common/static/components/toast-handler';
import { DialogData } from '@/views/common/static/components/dialog-handler';
import { PickerData } from '@/views/common/static/components/picker-handler/types';
import { ActionsheetData } from '@/views/common/static/components/actionsheet-handler';

const updateScrollableStyle = (scrollables: BooleanItem[]): boolean => {
  const scrollable = scrollables.length
    ? scrollables[scrollables.length - 1].value
    : true;
  if (scrollable) {
    document.body.style.removeProperty('overflow');
  } else {
    document.body.style.overflow = 'hidden';
  }
  return scrollable;
};

const updateAutoHeightStyle = (autoHeights: BooleanItem[]): boolean => {
  const autoHeight = autoHeights.length
    ? autoHeights[autoHeights.length - 1].value
    : true;
  const height = autoHeight ? '' : '100%';
  document.body.style.height = height;
  document.documentElement.style.height = height;
  return autoHeight;
};

const updateBackgroundStyle = (backgrounds): void => {
  const background = backgrounds.length
    ? backgrounds[backgrounds.length - 1].value
    : null;
  let color = background;
  if (background && typeof background === 'object') {
    color = background[getColorTheme()];
  }
  document.body.style.background = color;
  document.body.setAttribute('background', color);
  document.documentElement.style.background = color;
  document.documentElement.setAttribute('background', color);
};

const sorterDescending = (a, b): 1 | 0 | -1 => {
  if (a.index === b.index) {
    return 0;
  }
  return a.index > b.index ? 1 : -1;
};

/**
 * 向展示列表中插入对象
 * @param {string} type 类型字符串
 * @param {T[]} list 列表
 * @param {T} data 要插入的对象
 * @returns {void}
 */
function show<T extends { id?: UniqueID }>(type: string, list: T[], data: T): void {
  if (!data) {
    throw new Error(`show ${type} missing param!`);
  }
  if (!data.id) {
    throw new Error(`show ${type} missing id in param!`);
  }
  list.push(Object.assign({}, data));
}

/**
 * 根据标识符从展示列表中移除项
 * @param {BasicUniqueObject[]} list 列表
 * @param {UniqueID} id 标识符
 * @returns {BasicUniqueObject | undefined} 被移除的项
 */
function hide<T = unknown>(list, id): T {
  if (id) {
    return list.filter(p => p.id !== id);
  }
  return list.filter((_, i) => i !== 0);
}

export type PageTitleData = string | {
  title: string;
  route?: RouteInfo;
}

export interface HideToastParams extends BasicUniqueObject {
  action?: 'clear';
}

export interface HideDialogParams extends BasicUniqueObject {
  action?: 'clear';
}

export interface HideActionsheetData extends BasicUniqueObject {
  action?: 'clear';
}

export interface HidePickerData extends BasicUniqueObject {
  action?: 'clear';
}

interface BooleanItem {
  id: UniqueID;
  value: boolean;
}

export interface HeightItem {
  id: UniqueID;
  height: number;
}

export interface ExtraHeightItem {
  id: UniqueID;
  height: number;
  index: number;
}

export interface ExtraHeightParams {
  id: UniqueID;
  index?: number;
  height: number | string;
}

export interface RemoveExtraHeightParams {
  id: UniqueID;
}

export interface StoreCommonBusState {
  toasts: ToastData[];
  dialogs: DialogData[];
  actionsheets: ActionsheetData[];
  pickers: PickerData[];
  share: ShareData;
  scrolls: Record<string, number>;
  bodyScrollables: BooleanItem[];
  bodyScrollable: boolean;
  bodyAutoHeights: BooleanItem[];
  bodyAutoHeight: boolean;
  bodyBackgrounds: BooleanItem[];
  navbarTitle: string;
  navbarTitleCache: Record<string, string>;
  navbarHeight: number;
  navbarVisibles: BooleanItem[];
  headerExtraHeights: ExtraHeightItem[];
  tabbarHeight: number;
  tabbarVisibles: BooleanItem[];
  footerExtraHeights: ExtraHeightItem[];
  viewportTop: number;
  viewportBottom: number;
  viewportLeft: number;
  viewportRight: number;
  viewportWidth: number;
  viewportHeight: number;
  /** 是否正在跳转离开Web应用 */
  redirected: boolean;
}

export interface StoreCommonBusGetters {
  navbarVisible: boolean;
  tabbarVisible: boolean;
  headerHeights: HeightItem[];
  headerHeight: number;
  footerHeights: HeightItem[];
  footerHeight: number;
  mainViewportHeight: number;
  mainViewportWidth: number;
}

export default {
  namespaced: true,
  modules: {},
  state: {
    toasts: [],
    dialogs: [],
    actionsheets: [],
    pickers: [],
    scrolls: {},
    bodyScrollables: [],
    bodyScrollable: true,
    bodyAutoHeights: [],
    bodyAutoHeight: true,
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
    redirected: false,
  },
  getters: {
    navbarVisible: (state: StoreCommonBusState) => {
      const visible = state.navbarVisibles.length
        ? state.navbarVisibles[state.navbarVisibles.length - 1].value
        : isInMobileDevice() && !(isInWechat() || isInEmbedded());
      return visible;
    },
    tabbarVisible: (state: StoreCommonBusState) => {
      const length = state.tabbarVisibles.length;
      return length ? state.tabbarVisibles[length - 1].value : true;
    },
    headerHeights: (state: StoreCommonBusState, getters) => {
      const headerHeights: HeightItem[] = [];
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
    headerHeight: (state: StoreCommonBusState, getters) => {
      const navbarHeight = getters.navbarVisible ? state.navbarHeight : 0;
      let headerExtraHeight = 0;
      state.headerExtraHeights.forEach((p) => {
        headerExtraHeight += p.height;
      });
      return navbarHeight + headerExtraHeight + state.viewportTop;
    },
    footerHeights: (state: StoreCommonBusState, getters) => {
      const footerHeights: HeightItem[] = [];
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
    footerHeight: (state: StoreCommonBusState, getters) => {
      const tabbarHeight = getters.tabbarVisible ? state.tabbarHeight : 0;
      let footerExtraHeight = 0;
      state.footerExtraHeights.forEach((p) => {
        footerExtraHeight += p.height;
      });
      return tabbarHeight + footerExtraHeight + state.viewportBottom;
    },
    mainViewportHeight: (state: StoreCommonBusState, getters) => state.viewportHeight
      - (getters.navbarVisible ? state.navbarHeight : 0) - getters.headerHeight
      - (getters.tabbarVisible ? state.tabbarHeight : 0) - getters.footerHeight,
    mainViewportWidth: state => state.viewportWidth - state.viewportLeft - state.viewportRight,
  },
  actions: {},
  mutations: {
    [COMMON.SHOW_TOAST](state: StoreCommonBusState, {
      id,
      type,
      text,
      render,
      time = type === 'loading' ? 0 : 2000,
      position = 'center',
      closeable = false,
    }: ToastData) {
      show('toast', state.toasts, { id, text, render, time, type, position, closeable });
    },
    [COMMON.HIDE_TOAST](state: StoreCommonBusState, { id, action }: HideToastParams = {}) {
      if (action === 'clear') {
        state.toasts = [];
      } else {
        state.toasts = hide(state.toasts, id);
      }
    },
    [COMMON.SHOW_DIALOG](state: StoreCommonBusState, { id, type, title, content, render, isHTML, onclose, buttons = [] }: DialogData) {
      show('dialog', state.dialogs, { id, type, title, content, render, isHTML, onclose, buttons });
    },
    [COMMON.HIDE_DIALOG](state: StoreCommonBusState, { id, action }: HideDialogParams = {}) {
      if (action === 'clear') {
        state.dialogs = [];
      } else {
        state.dialogs = hide(state.dialogs, id);
      }
    },
    [COMMON.SHOW_ACTIONSHEET](state: StoreCommonBusState, { id, title, data, handler, oncancel, onclose }: ActionsheetData) {
      show('actionsheet', state.actionsheets, { id, title, data, handler, oncancel, onclose });
    },
    [COMMON.HIDE_ACTIONSHEET](state: StoreCommonBusState, { id, action }: { id?: UniqueID; action?: string } = {}) {
      if (action === 'clear') {
        state.actionsheets = [];
      } else {
        state.actionsheets = hide(state.actionsheets, id);
      }
    },
    [COMMON.SHOW_PICKER](state: StoreCommonBusState, { id, title, data, type, columns, maxLimit, value, handler }: PickerData) {
      show('picker', state.pickers, { id, title, data, type, columns, maxLimit, value, handler });
    },
    [COMMON.HIDE_PICKER](state: StoreCommonBusState, { id, action }: { id?: UniqueID; action?: string } = {}) {
      if (action === 'clear') {
        state.pickers = [];
      } else {
        state.pickers = hide(state.pickers, id);
      }
    },
    [COMMON.SAVE_SCROLL](state: StoreCommonBusState, { fullPath, scroll = null }: { fullPath: string; scroll: number | null }) {
      if (scroll === null) {
        delete state.scrolls[fullPath.replace(/\?.*$/u, '')];
      } else {
        state.scrolls[fullPath.replace(/\?.*$/u, '')] = scroll;
      }
    },
    [COMMON.SET_BODY_SCROLLABLE](state: StoreCommonBusState, { id, value }) {
      state.bodyScrollables = state.bodyScrollables
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      state.bodyScrollable = updateScrollableStyle(state.bodyScrollables);
    },
    [COMMON.REMOVE_BODY_SCROLLABLE](state: StoreCommonBusState, { id }) {
      state.bodyScrollables = state.bodyScrollables
        .filter(p => p.id !== id);
      state.bodyScrollable = updateScrollableStyle(state.bodyScrollables);
    },
    [COMMON.SET_BODY_AUTO_HEIGHT](state: StoreCommonBusState, { id, value }) {
      state.bodyAutoHeights = state.bodyAutoHeights
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      state.bodyAutoHeight = updateAutoHeightStyle(state.bodyAutoHeights);
    },
    [COMMON.REMOVE_BODY_AUTO_HEIGHT](state: StoreCommonBusState, { id }) {
      state.bodyAutoHeights = state.bodyAutoHeights
        .filter(p => p.id !== id);
      state.bodyAutoHeight = updateAutoHeightStyle(state.bodyAutoHeights);
    },
    [COMMON.SET_BODY_BACKGROUND](state: StoreCommonBusState, { id, value }) {
      state.bodyBackgrounds = state.bodyBackgrounds
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
      updateBackgroundStyle(state.bodyBackgrounds);
    },
    [COMMON.REMOVE_BODY_BACKGROUND](state: StoreCommonBusState, { id }) {
      state.bodyBackgrounds = state.bodyBackgrounds
        .filter(p => p.id !== id);
      updateBackgroundStyle(state.bodyBackgrounds);
    },
    [COMMON.SET_PAGE_SHARE](state: StoreCommonBusState, share: ShareData) {
      setPageShare(share);
      state.share = share;
    },
    [COMMON.SET_PAGE_TITLE](state: StoreCommonBusState, params: PageTitleData) {
      const title = typeof params === 'string' ? params : params.title;
      const route = (typeof params === 'object' && params.route) || store.state.common.route.current;
      if (!state.share) {
        setPageShare({ title, desc: '' });
      }
      setPageTitle(title);
      if (route && route.fullPath) {
        state.navbarTitleCache[route.fullPath] = title;
      }
      state.navbarTitle = title || '';
    },
    [COMMON.SET_HEADER_HEIGHT](state: StoreCommonBusState, height) {
      state.navbarHeight = height;
    },
    [COMMON.SET_NAVBAR_VISIBLE](state: StoreCommonBusState, { id, value }) {
      state.navbarVisibles = state.navbarVisibles
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
    },
    [COMMON.REMOVE_NAVBAR_VISIBLE](state: StoreCommonBusState, { id }) {
      state.navbarVisibles = state.navbarVisibles
        .filter(p => p.id !== id);
    },
    [COMMON.SET_TABBAR_HEIGHT](state: StoreCommonBusState, height) {
      state.tabbarHeight = height;
    },
    [COMMON.SET_TABBAR_VISIBLE](state: StoreCommonBusState, { id, value }) {
      state.tabbarVisibles = state.tabbarVisibles
        .filter(p => p.id !== id)
        .concat([{ id, value }]);
    },
    [COMMON.REMOVE_TABBAR_VISIBLE](state: StoreCommonBusState, { id }) {
      state.tabbarVisibles = state.tabbarVisibles
        .filter(p => p.id !== id);
    },
    [COMMON.SET_HEADER_EXTRA_HEIGHT](state: StoreCommonBusState, { id, index = 0, height }: ExtraHeightParams) {
      if (typeof height === 'string') {
        height = parseFloat(height) || 0;
      }
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
    [COMMON.REMOVE_HEADER_EXTRA_HEIGHT](state: StoreCommonBusState, { id }) {
      state.headerExtraHeights = state.headerExtraHeights.filter(p => p.id !== id);
    },
    [COMMON.SET_FOOTER_EXTRA_HEIGHT](state: StoreCommonBusState, { id, index = 0, height: oriHeight }) {
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
    [COMMON.REMOVE_FOOTER_EXTRA_HEIGHT](state: StoreCommonBusState, { id }) {
      state.footerExtraHeights = state.footerExtraHeights.filter(p => p.id !== id);
    },
    [COMMON.SET_VIEWPORT_SIZE](state: StoreCommonBusState, { top = 0, bottom = 0, left = 0, right = 0, width, height }) {
      state.viewportTop = top;
      state.viewportBottom = bottom;
      state.viewportLeft = left;
      state.viewportRight = right;
      state.viewportWidth = width;
      state.viewportHeight = height;
    },
    [COMMON.REDIRECT](state: StoreCommonBusState, { url }) {
      if (!state.redirected) {
        const baseUrl = `${window.location.origin}${process.env.PUBLIC_PATH || '/'}`;
        state.redirected = url.substring(0, baseUrl.length) !== baseUrl;
      }
      window.location.href = url;
    },
  },
};
