/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { StoreRootGetters, StoreRootState } from '@/store';
import { Event, Module } from '@/store/types';
import { getJssdkConfig, GetJssdkConfigResponse } from '@/services/api/getJssdkConfig';
import { COMMON } from './types';

import { storeCommonAppModule, StoreCommonAppState } from './app';
import { storeCommonBusModule, StoreCommonBusState } from './bus';
import { storeCommonRouteModule, StoreCommonRouteState } from './route';

export { COMMON } from './types';

interface StoreCommonIState {
  wechatSDKInfo: Record<string, GetJssdkConfigResponse>;
}

export interface StoreCommonState extends StoreCommonIState {
  // modules
  readonly app: StoreCommonAppState;
  readonly bus: StoreCommonBusState;
  readonly route: StoreCommonRouteState;
}

interface StoreCommonIGetters {}

export interface StoreCommonGetters extends StoreCommonIGetters {
  // modules
}

export type GetWechatSdkInfoAction = Event<typeof COMMON.GET_WECHAT_SDK_INFO, {
  url: string;
}, GetJssdkConfigResponse>;

export type StoreCommonAction =
  | GetWechatSdkInfoAction;

export type GetWechatSdkInfoMutation = Event<typeof COMMON.GET_WECHAT_SDK_INFO, {
  url: string;
  info: GetJssdkConfigResponse;
}>;

export type StoreCommonMutation =
  | GetWechatSdkInfoMutation;

export const storeCommonModule: Module<
StoreCommonIState, StoreCommonIGetters,
StoreCommonAction, StoreCommonMutation,
StoreRootState, StoreRootGetters
> = {
  namespaced: true,
  modules: {
    app: storeCommonAppModule,
    bus: storeCommonBusModule,
    route: storeCommonRouteModule,
  },
  state: window.__INITIAL_STATE__?.common || {
    wechatSDKInfo: {},
  },
  getters: {},
  actions: {
    [COMMON.GET_WECHAT_SDK_INFO]({ state, commit, rootState }, payload) {
      if (payload) {
        const { url } = payload;
        if (!state.wechatSDKInfo[url]) {
          const api = rootState.common.app.apis.api?.();
          if (api) {
            return new Promise((resolve, reject) => {
              getJssdkConfig(api, url)
                .then((res) => {
                  commit(COMMON.GET_WECHAT_SDK_INFO, {
                    url,
                    info: res.data,
                  });
                  resolve(res.data);
                  return res;
                })
                .catch(reject);
            });
          }
        }
        return Promise.resolve(state.wechatSDKInfo[url]);
      }
      return Promise.reject();
    },
  },
  mutations: {
    [COMMON.GET_WECHAT_SDK_INFO](state, payload) {
      if (payload) {
        const { url, info } = payload;
        state.wechatSDKInfo[url] = info;
      }
    },
  },
};

export type StoreCommonModule = typeof storeCommonModule;
