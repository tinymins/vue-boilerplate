/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { EntryParams } from '@/types';
import { StoreInstance, StoreRootGetters, StoreRootState } from '@/store';
import { Module, Event } from '@/store/types';
import { HttpInstance } from '@/services/create-api';
import { RouterInstance } from '@/router';
import { COMMON } from './types';

interface StoreCommonAppIState {
  entryParams: EntryParams | null;
  store: (() => StoreInstance) | null;
  http: (() => HttpInstance) | null;
  router: (() => RouterInstance) | null;
}

export interface StoreCommonAppState extends StoreCommonAppIState {
  // modules
}

interface StoreCommonAppIGetters {
}

export interface StoreCommonAppGetters extends StoreCommonAppIGetters {
  // modules
}

export type StoreCommonAppAction = never;

export type EntryParamsMutation = Event<typeof COMMON.ENTRY_PARAMS, EntryParams>;
export type StoreInstanceMutation = Event<typeof COMMON.STORE_INSTANCE, StoreInstance>;
export type HttpInstanceMutation = Event<typeof COMMON.HTTP_INSTANCE, HttpInstance>;
export type RouterInstanceMutation = Event<typeof COMMON.ROUTER_INSTANCE, RouterInstance>;

export type StoreCommonAppMutation =
  | EntryParamsMutation
  | StoreInstanceMutation
  | HttpInstanceMutation
  | RouterInstanceMutation;

export const storeCommonAppModule: Module<
StoreCommonAppIState, StoreCommonAppIGetters,
StoreCommonAppAction, StoreCommonAppMutation,
StoreRootState, StoreRootGetters
> = {
  namespaced: true,
  state: window.__INITIAL_STATE__?.common.app || {
    entryParams: null,
    store: null,
    http: null,
    router: null,
  },
  getters: {},
  actions: {},
  mutations: {
    [COMMON.ENTRY_PARAMS](state, entryParams) {
      if (entryParams) {
        state.entryParams = entryParams;
      }
    },
    [COMMON.STORE_INSTANCE](state, instance) {
      if (instance) {
        state.store = () => instance;
      }
    },
    [COMMON.HTTP_INSTANCE](state, instance) {
      if (instance) {
        state.http = () => instance;
      }
    },
    [COMMON.ROUTER_INSTANCE](state, instance) {
      if (instance) {
        state.router = () => instance;
      }
    },
  },
};

export type StoreCommonAppModule = typeof storeCommonAppModule;
