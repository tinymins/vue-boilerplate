/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 01:23:06
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/secret';
import { SECRET } from '@/store/types';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: [],
    limit: 25,
    point: null,
    filter: null,
    kw: '',
  },
  getters: {},
  actions: {
    [SECRET.LIST_REQUEST]({ commit, state }, params) {
      if (!state.lock ||
        params.reload ||
        state.filter !== params.filter ||
        state.kw !== params.kw
      ) {
        commit(SECRET.LIST_REQUEST, params);
        return new Promise((resolve, reject) => {
          api.getPosts(state).then((res) => {
            commit(SECRET.LIST_SUCCESS, res);
            resolve();
          }).catch(() => {
            commit(SECRET.LIST_FAILURE);
            reject();
          });
        });
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [SECRET.LIST_REQUEST](state, { reload, filter, kw }) {
      if (reload || state.filter !== filter || state.kw !== kw) {
        state.list = [];
        state.point = null;
      }
      state.filter = filter;
      state.kw = kw;
      state.lock = true;
    },
    [SECRET.LIST_SUCCESS](state, { data }) {
      if (data.length !== 0) {
        state.lock = false;
        state.list = state.list.concat(data);
        state.point = state.list[state.list.length - 1].time_point;
      }
    },
    [SECRET.LIST_FAILURE](state) {
      state.lock = false;
    },
  },
};
