/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type BasicUniqueObject, type UniqueID } from '@/types';
import { PUBLIC_PATH } from '@/config';
import { setPageShare, setPageTitle, ShareData } from '@/utils/connect';
import { type ColorTheme, getColorTheme, isInEmbedded, isInMobileDevice, isInWechat } from '@/utils/environment';
import { type RouteInfo } from '@/utils/navigation';
import { type StoreRootGetters, type StoreRootState } from '@/store';
import { type ActionsheetData } from '@/views/common/static/components/actionsheet-handler';
import { type DialogData } from '@/views/common/static/components/dialog-handler';
import { type PickerData } from '@/views/common/static/components/picker-handler/types';
import { type ToastData } from '@/views/common/static/components/toast-handler';

import { type Event, type Module } from '../types';
import { COMMON } from './types';

const updateScrollableStyle = (scrollables: BooleanItem[]): boolean => {
  const scrollable = scrollables.length > 0
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
  const autoHeight = autoHeights.length > 0
    ? autoHeights[autoHeights.length - 1].value
    : true;
  const height = autoHeight ? '' : '100%';
  document.body.style.height = height;
  document.documentElement.style.height = height;
  return autoHeight;
};

const updateBackgroundStyle = (backgrounds: BackgroundItem[]): void => {
  const background = backgrounds.length > 0
    ? backgrounds[backgrounds.length - 1].value
    : null;
  const color = background && typeof background === 'object'
    ? background[getColorTheme()]
    : background;
  document.body.style.background = '';
  document.body.style.background = color;
  document.body.setAttribute('background', color);
  document.documentElement.style.background = '';
  document.documentElement.style.background = color;
  document.documentElement.setAttribute('background', color);
};

const sorterDescending = (a: { index: number }, b: { index: number }): 1 | 0 | -1 => {
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
function hide<T extends BasicUniqueObject>(list: T[], id?: UniqueID): T[] {
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

interface BackgroundItem {
  id: UniqueID;
  value: string | Record<ColorTheme, string>;
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

interface StoreCommonBusIState {
  toasts: ToastData[];
  dialogs: DialogData[];
  actionsheets: ActionsheetData[];
  pickers: PickerData[];
  share?: ShareData;
  scrolls: Record<string, number>;
  bodyScrollables: BooleanItem[];
  bodyScrollable: boolean;
  bodyAutoHeights: BooleanItem[];
  bodyAutoHeight: boolean;
  bodyBackgrounds: BackgroundItem[];
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

export interface StoreCommonBusState extends StoreCommonBusIState {
  // modules
}

interface StoreCommonBusIGetters {
  readonly navbarVisible: boolean;
  readonly tabbarVisible: boolean;
  readonly headerHeights: HeightItem[];
  readonly headerHeight: number;
  readonly footerHeights: HeightItem[];
  readonly footerHeight: number;
  readonly mainViewportHeight: number;
  readonly mainViewportWidth: number;
}

export interface StoreCommonBusGetters extends StoreCommonBusIGetters {
  // modules
}

export type StoreCommonBusAction = never;

export type ShowToastMutation = Event<typeof COMMON.SHOW_TOAST, ToastData>;
export type HideToastMutation = Event<typeof COMMON.HIDE_TOAST, HideToastParams>;
export type ShowDialogMutation = Event<typeof COMMON.SHOW_DIALOG, DialogData>;
export type HideDialogMutation = Event<typeof COMMON.HIDE_DIALOG, HideDialogParams>;
export type ShowActionsheetMutation = Event<typeof COMMON.SHOW_ACTIONSHEET, ActionsheetData>;
export type HideActionsheetMutation = Event<typeof COMMON.HIDE_ACTIONSHEET, { id?: UniqueID; action?: string }>;
export type ShowPickerMutation = Event<typeof COMMON.SHOW_PICKER, PickerData>;
export type HidePickerMutation = Event<typeof COMMON.HIDE_PICKER, { id?: UniqueID; action?: string }>;
export type SaveScrollMutation = Event<typeof COMMON.SAVE_SCROLL, { fullPath: string; scroll: number | null }>;
export type SetBodyScrollableMutation = Event<typeof COMMON.SET_BODY_SCROLLABLE, BooleanItem>;
export type RemoveBodyScrollableMutation = Event<typeof COMMON.REMOVE_BODY_SCROLLABLE, { id?: UniqueID }>;
export type SetBodyAutoHeightMutation = Event<typeof COMMON.SET_BODY_AUTO_HEIGHT, BooleanItem>;
export type RemoveBodyAutoHeightMutation = Event<typeof COMMON.REMOVE_BODY_AUTO_HEIGHT, { id?: UniqueID }>;
export type SetBodyBackgroundMutation = Event<typeof COMMON.SET_BODY_BACKGROUND, BackgroundItem>;
export type RemoveBodyBackgroundMutation = Event<typeof COMMON.REMOVE_BODY_BACKGROUND, { id?: UniqueID }>;
export type SetPageShareMutation = Event<typeof COMMON.SET_PAGE_SHARE, ShareData>;
export type SetPageTitleMutation = Event<typeof COMMON.SET_PAGE_TITLE, PageTitleData>;
export type SetHeaderHeightMutation = Event<typeof COMMON.SET_HEADER_HEIGHT, number>;
export type SetNavbarVisibleMutation = Event<typeof COMMON.SET_NAVBAR_VISIBLE, BooleanItem>;
export type RemoveNavbarVisibleMutation = Event<typeof COMMON.REMOVE_NAVBAR_VISIBLE, { id?: UniqueID }>;
export type SetTabbarHeightMutation = Event<typeof COMMON.SET_TABBAR_HEIGHT, number>;
export type SetTabbarVisibleMutation = Event<typeof COMMON.SET_TABBAR_VISIBLE, BooleanItem>;
export type RemoveTabbarVisibleMutation = Event<typeof COMMON.REMOVE_TABBAR_VISIBLE, { id?: UniqueID }>;
export type SetHeaderExtraHeightMutation = Event<typeof COMMON.SET_HEADER_EXTRA_HEIGHT, ExtraHeightParams>;
export type RemoveHeaderExtraHeightMutation = Event<typeof COMMON.REMOVE_HEADER_EXTRA_HEIGHT, { id?: UniqueID }>;
export type SetFooterExtraHeightMutation = Event<typeof COMMON.SET_FOOTER_EXTRA_HEIGHT, { id: UniqueID; index?: number; height: number }>;
export type RemoveFooterExtraHeightMutation = Event<typeof COMMON.REMOVE_FOOTER_EXTRA_HEIGHT, { id?: UniqueID }>;
export type SetViewportSizeMutation = Event<typeof COMMON.SET_VIEWPORT_SIZE, {
  top?: number; bottom?: number; left?: number; right?: number; width: number; height: number;
}>;
export type RedirectMutation = Event<typeof COMMON.REDIRECT, { url: string }>;

export type StoreCommonBusMutation =
  | ShowToastMutation
  | HideToastMutation
  | ShowDialogMutation
  | HideDialogMutation
  | ShowActionsheetMutation
  | HideActionsheetMutation
  | ShowPickerMutation
  | HidePickerMutation
  | SaveScrollMutation
  | SetBodyScrollableMutation
  | RemoveBodyScrollableMutation
  | SetBodyAutoHeightMutation
  | RemoveBodyAutoHeightMutation
  | SetBodyBackgroundMutation
  | RemoveBodyBackgroundMutation
  | SetPageShareMutation
  | SetPageTitleMutation
  | SetHeaderHeightMutation
  | SetNavbarVisibleMutation
  | RemoveNavbarVisibleMutation
  | SetTabbarHeightMutation
  | SetTabbarVisibleMutation
  | RemoveTabbarVisibleMutation
  | SetHeaderExtraHeightMutation
  | RemoveHeaderExtraHeightMutation
  | SetFooterExtraHeightMutation
  | RemoveFooterExtraHeightMutation
  | SetViewportSizeMutation
  | RedirectMutation;

export const storeCommonBusModule: Module<
StoreCommonBusIState, StoreCommonBusIGetters,
StoreCommonBusAction, StoreCommonBusMutation,
StoreRootState, StoreRootGetters
> = {
  namespaced: true,
  modules: {},
  state: window.__INITIAL_STATE__?.common.bus || {
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
    navbarVisible: (state, _, rootState) => {
      const userAgent = rootState.common.app.entryParams?.userAgent || '';
      const visible = state.navbarVisibles.length > 0
        ? state.navbarVisibles[state.navbarVisibles.length - 1].value
        : isInMobileDevice(userAgent) && !(isInWechat(userAgent) || isInEmbedded(userAgent));
      return visible;
    },
    tabbarVisible: (state) => {
      const length = state.tabbarVisibles.length;
      return length ? state.tabbarVisibles[length - 1].value : true;
    },
    headerHeights: (state, getters) => {
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
    headerHeight: (state, getters) => {
      const navbarHeight = getters.navbarVisible ? state.navbarHeight : 0;
      let headerExtraHeight = 0;
      state.headerExtraHeights.forEach((p) => {
        headerExtraHeight += p.height;
      });
      return navbarHeight + headerExtraHeight + state.viewportTop;
    },
    footerHeights: (state, getters) => {
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
  actions: {},
  mutations: {
    [COMMON.SHOW_TOAST](state, payload) {
      if (payload) {
        const {
          id,
          type,
          text,
          render,
          time = type === 'loading' ? 0 : 2000,
          modal = false,
          position = 'center',
          closeable = false,
        } = payload;
        show('toast', state.toasts, { id, text, render, time, type, modal, position, closeable });
      }
    },
    [COMMON.HIDE_TOAST](state, { id, action } = {}) {
      state.toasts = action === 'clear'
        ? []
        : hide(state.toasts, id);
    },
    [COMMON.SHOW_DIALOG](state, payload) {
      if (payload) {
        const { id, type, title, content, render, isHTML, onclose, buttons = [] } = payload;
        show('dialog', state.dialogs, { id, type, title, content, render, isHTML, onclose, buttons });
      }
    },
    [COMMON.HIDE_DIALOG](state, { id, action } = {}) {
      state.dialogs = action === 'clear'
        ? []
        : hide(state.dialogs, id);
    },
    [COMMON.SHOW_ACTIONSHEET](state, payload) {
      if (payload) {
        const { id, title, data, handler, oncancel, onclose } = payload;
        show('actionsheet', state.actionsheets, { id, title, data, handler, oncancel, onclose });
      }
    },
    [COMMON.HIDE_ACTIONSHEET](state, { id, action } = {}) {
      state.actionsheets = action === 'clear'
        ? []
        : hide(state.actionsheets, id);
    },
    [COMMON.SHOW_PICKER](state, payload) {
      if (payload) {
        const { id, title, data, type, columns, maxLimit, value, handler } = payload;
        show('picker', state.pickers, { id, title, data, type, columns, maxLimit, value, handler });
      }
    },
    [COMMON.HIDE_PICKER](state, { id, action } = {}) {
      state.pickers = action === 'clear'
        ? []
        : hide(state.pickers, id);
    },
    [COMMON.SAVE_SCROLL](state, payload) {
      if (payload) {
        const { fullPath, scroll = null } = payload;
        if (scroll === null) {
          delete state.scrolls[fullPath.replace(/\?.*$/u, '')];
        } else {
          state.scrolls[fullPath.replace(/\?.*$/u, '')] = scroll;
        }
      }
    },
    [COMMON.SET_BODY_SCROLLABLE](state, payload) {
      if (payload) {
        const { id, value } = payload;
        state.bodyScrollables = [
          ...state.bodyScrollables.filter(p => p.id !== id),
          { id, value },
        ];
        state.bodyScrollable = updateScrollableStyle(state.bodyScrollables);
      }
    },
    [COMMON.REMOVE_BODY_SCROLLABLE](state, payload) {
      if (payload) {
        const { id } = payload;
        state.bodyScrollables = state.bodyScrollables
          .filter(p => p.id !== id);
        state.bodyScrollable = updateScrollableStyle(state.bodyScrollables);
      }
    },
    [COMMON.SET_BODY_AUTO_HEIGHT](state, payload) {
      if (payload) {
        const { id, value } = payload;
        state.bodyAutoHeights = [
          ...state.bodyAutoHeights.filter(p => p.id !== id),
          { id, value },
        ];
        state.bodyAutoHeight = updateAutoHeightStyle(state.bodyAutoHeights);
      }
    },
    [COMMON.REMOVE_BODY_AUTO_HEIGHT](state, payload) {
      if (payload) {
        const { id } = payload;
        state.bodyAutoHeights = state.bodyAutoHeights
          .filter(p => p.id !== id);
        state.bodyAutoHeight = updateAutoHeightStyle(state.bodyAutoHeights);
      }
    },
    [COMMON.SET_BODY_BACKGROUND](state, payload) {
      if (payload) {
        const { id, value } = payload;
        state.bodyBackgrounds = [
          ...state.bodyBackgrounds.filter(p => p.id !== id),
          { id, value },
        ];
        updateBackgroundStyle(state.bodyBackgrounds);
      }
    },
    [COMMON.REMOVE_BODY_BACKGROUND](state, payload) {
      if (payload) {
        const { id } = payload;
        state.bodyBackgrounds = state.bodyBackgrounds
          .filter(p => p.id !== id);
        updateBackgroundStyle(state.bodyBackgrounds);
      }
    },
    [COMMON.SET_PAGE_SHARE](state, payload) {
      if (payload) {
        const share = payload;
        setPageShare(share);
        state.share = share;
      }
    },
    [COMMON.SET_PAGE_TITLE](state, payload) {
      if (payload) {
        const params = payload;
        const title = typeof params === 'string' ? params : params.title;
        const route = typeof params === 'object' ? params.route : void 0;
        if (!state.share) {
          setPageShare({ title, desc: '', route });
        }
        setPageTitle(title);
        if (route && route.fullPath) {
          state.navbarTitleCache[route.fullPath] = title;
        }
        state.navbarTitle = title || '';
      }
    },
    [COMMON.SET_HEADER_HEIGHT](state, payload) {
      if (typeof payload === 'number') {
        const height = payload;
        state.navbarHeight = height;
      }
    },
    [COMMON.SET_NAVBAR_VISIBLE](state, payload) {
      if (payload) {
        const { id, value } = payload;
        state.navbarVisibles = [
          ...state.navbarVisibles.filter(p => p.id !== id),
          { id, value },
        ];
      }
    },
    [COMMON.REMOVE_NAVBAR_VISIBLE](state, payload) {
      if (payload) {
        const { id } = payload;
        state.navbarVisibles = state.navbarVisibles
          .filter(p => p.id !== id);
      }
    },
    [COMMON.SET_TABBAR_HEIGHT](state, payload) {
      if (typeof payload === 'number') {
        const height = payload;
        state.tabbarHeight = height;
      }
    },
    [COMMON.SET_TABBAR_VISIBLE](state, payload) {
      if (payload) {
        const { id, value } = payload;
        state.tabbarVisibles = [
          ...state.tabbarVisibles.filter(p => p.id !== id),
          { id, value },
        ];
      }
    },
    [COMMON.REMOVE_TABBAR_VISIBLE](state, payload) {
      if (payload) {
        const { id } = payload;
        state.tabbarVisibles = state.tabbarVisibles
          .filter(p => p.id !== id);
      }
    },
    [COMMON.SET_HEADER_EXTRA_HEIGHT](state, payload) {
      if (payload) {
        const { id, index = 0 } = payload;
        const height = typeof payload.height === 'string'
          ? Number.parseFloat(payload.height) || 0
          : payload.height;
        const headerExtraHeights = [...state.headerExtraHeights];
        const i = headerExtraHeights.findIndex(p => p.id === id);
        if (i >= 0) {
          headerExtraHeights[i].index = index;
          headerExtraHeights[i].height = height;
        } else {
          headerExtraHeights.push({ id, index, height });
        }
        headerExtraHeights.sort(sorterDescending);
        state.headerExtraHeights = headerExtraHeights;
      }
    },
    [COMMON.REMOVE_HEADER_EXTRA_HEIGHT](state, payload) {
      if (payload) {
        const { id } = payload;
        state.headerExtraHeights = state.headerExtraHeights.filter(p => p.id !== id);
      }
    },
    [COMMON.SET_FOOTER_EXTRA_HEIGHT](state, payload) {
      if (payload) {
        const { id, index = 0 } = payload;
        const height = typeof payload.height === 'string'
          ? Number.parseFloat(payload.height) || 0
          : payload.height;
        const footerExtraHeights = [...state.footerExtraHeights];
        const i = footerExtraHeights.findIndex(p => p.id === id);
        if (i >= 0) {
          footerExtraHeights[i].index = index;
          footerExtraHeights[i].height = height;
        } else {
          footerExtraHeights.push({ id, index, height });
        }
        footerExtraHeights.sort(sorterDescending);
        state.footerExtraHeights = footerExtraHeights;
      }
    },
    [COMMON.REMOVE_FOOTER_EXTRA_HEIGHT](state, payload) {
      if (payload) {
        const { id } = payload;
        state.footerExtraHeights = state.footerExtraHeights.filter(p => p.id !== id);
      }
    },
    [COMMON.SET_VIEWPORT_SIZE](state, payload) {
      if (payload) {
        const { top = 0, bottom = 0, left = 0, right = 0, width, height } = payload;
        state.viewportTop = top;
        state.viewportBottom = bottom;
        state.viewportLeft = left;
        state.viewportRight = right;
        state.viewportWidth = width;
        state.viewportHeight = height;
      }
    },
    [COMMON.REDIRECT](state, payload) {
      if (payload) {
        const { url } = payload;
        if (!state.redirected) {
          const baseUrl = `${window.location.origin}${PUBLIC_PATH}`;
          state.redirected = url.slice(0, Math.max(0, baseUrl.length)) !== baseUrl;
        }
        window.location.href = url;
      }
    },
  },
};

export type StoreCommonBusModule = typeof storeCommonBusModule;
