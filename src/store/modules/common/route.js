/**
 * @Author: 翟一鸣 (tinymins) @ derzh.com
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
