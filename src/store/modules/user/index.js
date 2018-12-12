/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/user';
import { USER } from '@/store/types';
import router from '@/router';
import store from '@/store';
import { isInWechat, isLocalhost } from '@/utils/environment';
import { getAuthorizeURL } from '@/utils/authorization';
import { showLoading, hideLoading } from '@/store/utils';

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
      return null;
    },
    status: state => state.status,
  },
  actions: {
    [USER.LOGIN]({ dispatch, rootState }, { phone, code }) {
      return new Promise((resolve, reject) => {
        const loading = showLoading({ text: 'Logging in' });
        api.login(phone, code).then(() => {
          dispatch(USER.GET, { reload: true }).then(() => {
            const redirect = rootState.route.query.redirect;
            if (redirect) {
              router.push({ path: redirect });
            } else {
              router.push({ name: 'user_index' });
            }
            resolve();
          });
        }).catch(reject).finally(() => {
          hideLoading({ id: loading });
        });
      });
    },
    [USER.LOGOUT]({ dispatch }) {
      return new Promise((resolve, reject) => {
        const loading = showLoading({ text: 'Logging out' });
        api.logout().then(() => {
          dispatch(USER.CLEAR);
          resolve();
        }).catch(reject).finally(() => {
          hideLoading({ id: loading });
        });
      });
    },
    [USER.GET]({ commit, state }, { reload, refresh, strict = true } = {}) {
      if (refresh ? state.user : reload || !state.user) {
        return new Promise((resolve) => {
          const loading = showLoading({ text: 'Fetching login status' });
          api.getUser(strict).then((res) => {
            commit(USER.GET, {
              status: res.data.data ? res.status : 401,
              user: res.data.data || {},
            });
            resolve();
          }).catch((err) => {
            commit(USER.GET, { status: err.response.status });
            resolve();
          }).finally(() => {
            hideLoading({ id: loading });
          });
        });
      }
      return Promise.resolve();
    },
    [USER.CLEAR]({ commit, rootState: { route: { fullPath } } }, { isLogout = false, requiresAuth = false } = {}) {
      commit(isLogout ? USER.LOGOUT : USER.CLEAR);
      const route = store.state.common.route.to || router.resolve(fullPath).route;
      if (requiresAuth || route.matched.some(record => record.meta.requiresAuth)) {
        if (!isLocalhost() && isInWechat() && getAuthorizeURL('wx', 'login')) {
          window.location = getAuthorizeURL('wx', 'login', route);
        } else {
          router.replace({
            name: 'user_login',
            query: { redirect: route.fullPath },
          });
        }
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [USER.GET](state, { status, user = {} }) {
      state.user = user;
      state.status = status;
    },
    [USER.LOGOUT](state) {
      state.user = {};
      state.status = 401;
    },
    [USER.CLEAR](state) {
      state.user = null;
      state.status = 401;
    },
  },
};
