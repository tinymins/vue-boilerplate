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

import busModule, { StoreCommonBusState } from './bus';
import routeModule, { StoreCommonRouteState } from './route';

export interface StoreCommonState {
  wechatSDKInfo: JssdkConfig;
  // modules
  bus: StoreCommonBusState;
  route: StoreCommonRouteState;
}

export default {
  namespaced: true,
  modules: {
    bus: busModule,
    route: routeModule,
  },
  state: {
    wechatSDKInfo: {},
  },
  getters: {},
  actions: {
    [COMMON.GET_WECHAT_SDK_INFO]({ state, commit }, { url }) {
      if (!state.wechatSDKInfo[url]) {
        return new Promise((resolve, reject) => {
          api.getWechatSDKInfo(url).then((res) => {
            commit(COMMON.GET_WECHAT_SDK_INFO, {
              url,
              info: res.data,
            });
            resolve(res.data);
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
