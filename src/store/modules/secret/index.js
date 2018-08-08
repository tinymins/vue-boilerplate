/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 12:06:30
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/secret';
import { SECRET } from '@/store/types';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: [],
    temp: [],
    limit: 25,
    point: null,
    filter: null,
    kw: '',
  },
  getters: {},
  actions: {
    [SECRET.LIST_REQUEST]({ commit, state }, params) {
      if (!state.lock
        || params.reload
        || state.filter !== params.filter
        || state.kw !== params.kw
      ) {
        commit(SECRET.LIST_REQUEST, params);
        return new Promise((resolve, reject) => {
          api.getPostList(
            params.reload
              ? 'Fetching post list'
              : 'Fetching more posts',
            state,
          ).then((res) => {
            commit(SECRET.LIST_SUCCESS, res.data);
            resolve();
          }).catch(() => {
            commit(SECRET.LIST_FAILURE);
            reject();
          });
        });
      }
      return Promise.resolve();
    },
    [SECRET.POSTS](_, id) {
      return new Promise((resolve, reject) => {
        api.getPosts(
          'Fetching posts',
          id,
        ).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
  mutations: {
    [SECRET.LIST_REQUEST](state, { reload, filter, kw }) {
      if (reload || state.filter !== filter || state.kw !== kw) {
        state.temp = [];
        state.point = null;
      }
      state.filter = filter;
      state.kw = kw;
      state.lock = true;
    },
    [SECRET.LIST_SUCCESS](state, { data }) {
      state.temp = state.temp.concat(data.filter(p => p.id !== 0));
      state.point = state.temp[state.temp.length - 1].time_point;
      state.list = state.temp;
      if (data.length !== 0) {
        state.lock = false;
      }
    },
    [SECRET.LIST_FAILURE](state) {
      state.lock = false;
    },
  },
};
