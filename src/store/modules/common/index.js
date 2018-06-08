/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-05-23 16:18:48
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-08 17:29:07
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import { COMMON } from '@/store/types';
import * as api from '@/store/api/common';

export default {
  namespaced: true,
  state: {
    toast: null,
    toasts: [],
    loading: null,
    loadings: [],
    message: null,
    messages: [],
    scrolls: {},
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
      if (typeof id !== 'number' && typeof id !== 'string') {
        throw new Error('Require id to be set as number or sring!');
      }
      const loading = { id, text };
      if (state.loading) {
        state.loadings.push(state.loading);
      }
      state.loading = loading;
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
      type = 'warning',
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
    [COMMON.SAVE_SCROLL](state, { fullPath, scroll = null }) {
      if (scroll === null) {
        delete state.scrolls[fullPath];
      } else {
        state.scrolls[fullPath] = scroll;
      }
    },
    [COMMON.GET_WECHAT_SDK_INFO](state, { url, info }) {
      state.wechatSDKInfo[url] = info;
    },
  },
};
