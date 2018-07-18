/**
 * @Author: 翟一鸣 (tinymins) @ derzh.com
 * @Date:   2017-07-25 16:42:15
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-01-26 19:13:33
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
import { COMMON } from '@/store/types';

export default {
  namespaced: true,
  state: {
    entry: null,
    from: null,
    to: null,
    current: null,
    historyMode: null,
  },
  getters: {},
  actions: {},
  mutations: {
    [COMMON.ROUTE_BEFORE_CHANGE](state, { from, to }) {
      if (state.historyMode === 'triggered') {
        state.historyMode = 'history';
      } else {
        state.historyMode = null;
      }
      if (!state.entry) {
        state.entry = to;
      }
      state.from = from;
      state.to = to;
    },
    [COMMON.ROUTE_CHANGE](state, { from, to }) {
      if (!state.entry) {
        state.entry = to;
      }
      state.from = from;
      state.to = to;
      state.current = to;
    },
    [COMMON.ROUTE_HISTORY_MODE](state) {
      state.historyMode = 'triggered';
    },
  },
};
