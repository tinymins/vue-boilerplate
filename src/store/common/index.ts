/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import * as api from '@/api/common';
import { JssdkConfig } from '@/api/types/common';
import { COMMON } from '@/store/types';
import { StoreActionEnv } from '@/store/actions';

import appModule, { StoreCommonAppState } from './app';
import busModule, { StoreCommonBusState } from './bus';
import routeModule, { StoreCommonRouteState } from './route';

export interface StoreCommonState {
  wechatSDKInfo: JssdkConfig;
  // modules
  app: StoreCommonAppState;
  bus: StoreCommonBusState;
  route: StoreCommonRouteState;
}

export default {
  namespaced: true,
  modules: {
    app: appModule,
    bus: busModule,
    route: routeModule,
  },
  state: {
    wechatSDKInfo: {},
  },
  getters: {},
  actions: {
    [COMMON.GET_WECHAT_SDK_INFO]({ state, commit, rootState }: StoreActionEnv<StoreCommonState>, { url }) {
      if (!state.wechatSDKInfo[url]) {
        return new Promise((resolve, reject) => {
          api.getWechatSDKInfo(rootState.common.app.http(), url).then((res) => {
            commit(COMMON.GET_WECHAT_SDK_INFO, {
              url,
              info: res.data,
            });
            resolve(res.data);
            return res;
          }).catch(reject);
        });
      }
      return Promise.resolve(state.wechatSDKInfo[url]);
    },
  },
  mutations: {
    [COMMON.GET_WECHAT_SDK_INFO](state, { url, info }) {
      state.wechatSDKInfo[url] = info;
    },
  },
};
