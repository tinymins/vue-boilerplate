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
import { checkAuthorizeRedirect } from '@/utils/authorization';
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
              router.push({ name: 'index' });
            }
            resolve();
          });
        }).catch(reject).finally(() => {
          hideLoading({ id: loading });
        });
      });
    },
    [USER.LOGOUT]({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        const loading = showLoading({ text: 'Logging out' });
        api.logout().then(async () => {
          commit(USER.LOGOUT);
          const { route } = router.resolve(rootState.common.route.to.fullPath);
          const redirect = await checkAuthorizeRedirect(route, 401);
          if (redirect) {
            router.push(redirect);
          }
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
  },
};
