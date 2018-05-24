/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-03 21:15:10
*/
/* eslint no-param-reassign: ["error", { "props": false }] */
import router from '@/router';
import * as api from '@/store/api/user';
import { USER } from '@/store/types';
import { isInWechat } from '@/utils/environment';
import { WECHAT_LOGIN_URL } from '@/config';

export default {
  namespaced: true,
  state: {
    user: null,
    status: 401,
  },
  getters: {
    user: (state) => {
      if (state.user && Object.keys(state.user).length !== 0) {
        return state.user;
      }
      return false;
    },
    status: state => state.status,
  },
  actions: {
    [USER.LOGIN]({ commit, dispatch, rootState }, { name, code }) {
      return new Promise((resolve, reject) => {
        api.login(
          'Logging in',
          name, code,
        ).then(() => {
          dispatch(USER.GET, true).then(() => {
            const redirect = rootState.route.query.redirect;
            if (redirect) {
              router.push({ path: redirect });
            } else {
              router.push({ name: 'user_index' });
            }
            resolve();
          });
        }).catch(reject);
      });
    },
    [USER.LOGOUT]({ dispatch }) {
      return new Promise((resolve, reject) => {
        api.logout('Logging out').then(() => {
          dispatch(USER.CLEAR);
          resolve();
        }).catch(reject);
      });
    },
    [USER.GET]({ commit, state }, force) {
      if (force || !state.user) {
        return new Promise((resolve) => {
          api.getUser('Fetching login status').then((res) => {
            commit(USER.GET, {
              status: res.data.data ? res.status : 401,
              user: res.data.data || {},
            });
            resolve();
          }).catch((err) => {
            commit(USER.GET, { status: err.response.status });
            resolve();
          });
        });
      }
      return Promise.resolve();
    },
    [USER.CLEAR]({ commit, rootState }) {
      commit(USER.LOGOUT);
      const requiresAuth = rootState.route.meta.requiresAuth;
      if (requiresAuth) {
        if (isInWechat() && WECHAT_LOGIN_URL) {
          window.location = WECHAT_LOGIN_URL;
        } else {
          router.push({
            name: 'user_login',
            query: { redirect: rootState.route.fullPath },
          });
        }
      }
    },
  },
  mutations: {
    [USER.GET](state, { status, user = {} }) {
      state.user = user;
      state.status = status;
    },
    [USER.LOGOUT](state) {
      state.user = {};
    },
    [USER.CLEAR](state) {
      state.user = {};
      state.status = 401;
    },
  },
};
