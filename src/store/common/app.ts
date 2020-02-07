/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { EntryParams } from '@/types';
import { COMMON } from '@/store/types';
import { StoreInstance } from '@/store';
import { HttpInstance } from '@/api/driver';
import { RouterInstance } from '@/router';

export interface StoreCommonAppState {
  entryParams: EntryParams;
  store: () => StoreInstance;
  http: () => HttpInstance;
  router: () => RouterInstance;
}

export default {
  namespaced: true,
  state: {
    entryParams: null,
    store: null,
    http: null,
    router: null,
  },
  getters: {},
  actions: {},
  mutations: {
    [COMMON.ENTRY_PARAMS](state, entryParams: EntryParams) {
      state.entryParams = entryParams;
    },
    [COMMON.STORE_INSTANCE](state, instance: StoreInstance) {
      state.store = () => instance;
    },
    [COMMON.HTTP_INSTANCE](state, instance: HttpInstance) {
      state.http = () => instance;
    },
    [COMMON.ROUTER_INSTANCE](state, instance: RouterInstance) {
      state.router = () => instance;
    },
  },
};
