/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:31:44
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/user';
import { USER } from '@/store/types';


export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    user: (state) => {
      if (state.user && Object.keys(state.user).length !== 0) {
        return state.user;
      }
      return false;
    },
  },
  actions: {
    [USER.GET]({ commit }) {
      return api.getUser().then((data) => {
        commit(USER.GET, data.data);
      }).catch(() => {
        commit(USER.LOGOUT);
      });
    },
    [USER.DEBUG]({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.debugLogin(data).then((res) => {
          commit(USER.GET, res.data);
          resolve();
        }).catch(() => {
          // commit(USER.CLEAR, err, { root: true });
          reject();
        });
      });
    },
  },
  mutations: {
    [USER.GET](state, data) {
      state.user = data;
    },
    [USER.LOGOUT](state) {
      state.user = null;
    },
  },
};
