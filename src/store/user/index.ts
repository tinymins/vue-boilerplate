/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as api from '@/api/user';
import { UserFull } from '@/api/types/user';
import { HttpResponseData } from '@/api/driver/http';
import { StoreRootGetters, StoreRootState } from '@/store';
import { Module, Event } from '@/store/types';
import { finalizeAction, ActionType } from '@/store/actions';
import { AUTH_STATE } from '@/config';
import { camelize } from '@/utils/transfer';
import { checkAuthorizeRedirect } from '@/utils/authorization';
import * as USER from './types';

export * as USER from './types';

interface StoreUserIState {
  user?: UserFull | null;
  errmsg: string | null;
  prevUser: UserFull | null;
  status: number | null;
  referral: number; // 介绍人id
}

export interface StoreUserState extends StoreUserIState {
  // modules
}

export interface StoreUserIGetters {
  readonly user: UserFull | null;
  readonly status: StoreUserIState['status'];
}

export interface StoreUserGetters extends StoreUserIGetters {
  // modules
}

export type GetAction = Event<typeof USER.GET, {
  action?: ActionType;
  strict?: boolean;
  silent?: boolean;
} | undefined>;

export type LoginAction = Event<typeof USER.LOGIN, {
  phone: string;
  code: string;
}>;

export type LogoutAction = Event<typeof USER.LOGOUT>;

export type StoreUserAction =
  | GetAction
  | LoginAction
  | LogoutAction;

export type GetMutation = Event<typeof USER.GET, {
  status: number;
  user: UserFull | null;
  errmsg: string;
}>;

export type LogoutMutation = Event<typeof USER.LOGOUT>;

export type StoreUserMutation =
  | GetMutation
  | LogoutMutation;

export const storeUserModule: Module<
StoreUserIState, StoreUserIGetters,
StoreUserAction, StoreUserMutation,
StoreRootState, StoreRootGetters
> = {
  namespaced: true,
  modules: {},
  state: {
    user: void 0,
    errmsg: null,
    prevUser: null,
    status: null,
    referral: 0,
  },
  getters: {
    user: (state) => {
      if (state.status === AUTH_STATE.LOGGED_IN && state.user) {
        return state.user;
      }
      return null;
    },
    status: state => state.status,
  },
  actions: {
    [USER.LOGIN]({ dispatch, rootState }, payload) {
      if (payload) {
        const http = rootState.common.app.http?.();
        const router = rootState.common.app.router?.();
        if (http && router) {
          return new Promise<void>((resolve, reject) => {
            api.login(http, payload.phone, payload.code)
              .then((res) => {
                dispatch(USER.GET, { action: 'reload', silent: true })
                  .then((r) => {
                    const redirect = rootState.common.route.current?.query.redirect;
                    if (redirect) {
                      router.push({ path: redirect });
                    } else {
                      router.push({ name: 'index' });
                    }
                    resolve();
                    return r;
                  })
                  .catch((error) => { throw error; });
                return res;
              })
              .catch(reject);
          });
        }
      }
      return Promise.resolve();
    },
    [USER.LOGOUT]({ commit, rootState }) {
      const http = rootState.common.app.http?.();
      const router = rootState.common.app.router?.();
      const store = rootState.common.app.store?.();
      if (http && router && store) {
        return new Promise<void>((resolve, reject) => {
          api.logout(http)
            .then(async (res) => {
              commit(USER.LOGOUT);
              const route = rootState.common.route.to?.fullPath
                ? router.resolve(rootState.common.route.to.fullPath).route
                : '';
              const redirect = await checkAuthorizeRedirect(store, route);
              if (redirect) {
                router.push(redirect);
              }
              resolve();
              return res;
            })
            .catch(reject);
        });
      }
      return Promise.resolve();
    },
    [USER.GET](
      { commit, state, rootState },
      { action: rawAction = '', strict = true, silent = false } = {},
    ): Promise<void> {
      const action = finalizeAction(rawAction, state.status !== null);
      if (action) {
        // window.__INITIAL_STATE__ = {"errcode":401,"errmsg":"未授权"}; // 测试数据
        if (typeof window.__INITIAL_STATE__ === 'object') {
          const res = camelize<HttpResponseData<UserFull>>(window.__INITIAL_STATE__);
          commit(USER.GET, {
            status: res.errcode,
            user: res.data || void 0,
            errmsg: res.errmsg,
          });
          delete window.__INITIAL_STATE__;
        } else {
          const http = rootState.common.app.http?.();
          if (http) {
            return new Promise((resolve, reject) => {
              api.getUser(http, strict, silent)
                .then((res) => {
                  commit(USER.GET, {
                    status: res.data ? res.errcode : AUTH_STATE.GUEST,
                    user: res.data || null,
                    errmsg: res.errmsg,
                  });
                  resolve();
                  return res;
                })
                .catch((error) => {
                  if (error && error.response) {
                    commit(USER.GET, {
                      status: error.response.errcode,
                      user: null,
                      errmsg: error.response.errmsg,
                    });
                    resolve();
                  } else {
                    reject(error);
                  }
                });
            });
          }
        }
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [USER.GET](state, payload) {
      if (payload) {
        const { status, user, errmsg } = payload;
        if (state.prevUser && state.prevUser.id !== user?.id) {
          setTimeout(() => window.location.reload(), 1000);
        }
        state.user = user;
        state.errmsg = errmsg;
        state.status = status;
        state.prevUser = user;
      }
    },
    [USER.LOGOUT](state) {
      state.user = null;
      state.status = AUTH_STATE.GUEST;
    },
  },
};
