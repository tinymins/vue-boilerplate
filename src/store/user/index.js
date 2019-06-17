/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import get from 'lodash/get';
import store from '@/store';
import * as api from '@/api/user';
import { USER, CHAT } from '@/store/types';
import { finalizeAction } from '@/store/actions';
import router from '@/router';
import { AUTH_STATE } from '@/config';
import { updateObject } from '@/utils/util';
import { camelize } from '@/utils/transfer';
import { checkAuthorizeRedirect } from '@/utils/authorization';

export default {
  namespaced: true,
  state: {
    codeTime: 0,
    user: null,
    prevUser: null,
    status: AUTH_STATE.GUEST,
  },
  getters: {
    user: (state) => {
      if (state.status === AUTH_STATE.LOGGED_IN && state.user && Object.keys(state.user).length !== 0) {
        return state.user;
      }
      return null;
    },
    status: state => state.status,
  },
  actions: {
    [USER.LOGIN]({ dispatch, rootState }, { phone, code }) {
      return new Promise((resolve, reject) => {
        api.login(phone, code).then(() => {
          dispatch(USER.GET, { action: 'reload', silent: true }).then(() => {
            const redirect = rootState.route.query.redirect;
            if (redirect) {
              router.push({ path: redirect });
            } else {
              router.push({ name: 'index' });
            }
            resolve();
          });
        }).catch(reject);
      });
    },
    [USER.LOGOUT]({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        api.logout().then(async () => {
          commit(USER.LOGOUT);
          const { route } = router.resolve(rootState.common.route.to.fullPath);
          const redirect = await checkAuthorizeRedirect(route);
          if (redirect) {
            router.push(redirect);
          }
          resolve();
        }).catch(reject);
      });
    },
    [USER.GET]({ commit, state }, { action: rawAction, strict = true, silent } = {}) {
      const action = finalizeAction(rawAction, state.user);
      if (action) {
        // window.__INITIAL_STATE__ = {"errcode":401,"errmsg":"未授权"}; // 测试数据
        if (typeof window.__INITIAL_STATE__ === 'object') {
          const res = camelize(window.__INITIAL_STATE__);
          commit(USER.GET, {
            status: res.errcode,
            user: res.data || {},
          });
          delete window.__INITIAL_STATE__;
        } else {
          return new Promise((resolve, reject) => {
            api.getUser(strict, silent).then((res) => {
              commit(USER.GET, {
                status: res.data ? res.errcode : AUTH_STATE.GUEST,
                user: res.data || {},
              });
              resolve();
            }).catch((err) => {
              if (err && err.response) {
                commit(USER.GET, {
                  status: err.response.errcode,
                  user: err.response.data || {},
                });
                resolve();
              } else {
                reject(err);
              }
            });
          });
        }
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [USER.GET](state, { status, user = {} }) {
      if (state.prevUser && state.prevUser.id && state.prevUser.id !== user.id) {
        setTimeout(() => window.location.reload(), 1000);
      }
      state.user = user;
      state.status = status;
      state.prevUser = user;
    },
    [USER.LOGOUT](state) {
      state.user = {};
      state.status = AUTH_STATE.GUEST;
    },
  },
};
