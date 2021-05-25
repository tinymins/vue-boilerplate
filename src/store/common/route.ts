/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { routeClone, RouteInfo } from '@/utils/navigation';
import { StoreRootGetters, StoreRootState } from '@/store';
import { Module, Event } from '@/store/types';
import { Route } from 'vue-router';
import * as COMMON from './types';

export interface StoreCommonRouteIState {
  entry?: RouteInfo;
  from?: RouteInfo;
  to?: RouteInfo;
  current?: RouteInfo;
  historyMode?: 'triggered' | 'history' | null;
}

export interface StoreCommonRouteState extends StoreCommonRouteIState {
  // modules
}

interface StoreCommonRouteIGetters {
}

export interface StoreCommonRouteGetters extends StoreCommonRouteIGetters {
  // modules
}

export type StoreCommonRouteAction = never;

export type RouteBeforeChangeMutation = Event<typeof COMMON.ROUTE_BEFORE_CHANGE, {
  from: Route;
  to: Route;
}>;
export type RouteChangeMutation = Event<typeof COMMON.ROUTE_CHANGE, {
  from: Route;
  to: Route;
}>;
export type RouteHistoryModeMutation = Event<typeof COMMON.ROUTE_HISTORY_MODE>;

export type StoreCommonRouteMutation =
  | RouteBeforeChangeMutation
  | RouteChangeMutation
  | RouteHistoryModeMutation;

export const storeCommonRouteModule: Module<
StoreCommonRouteIState, StoreCommonRouteIGetters,
StoreCommonRouteAction, StoreCommonRouteMutation,
StoreRootState, StoreRootGetters
> = {
  namespaced: true,
  state: {
    entry: void 0,
    from: void 0,
    to: void 0,
    current: void 0,
    historyMode: void 0,
  },
  getters: {},
  actions: {},
  mutations: {
    [COMMON.ROUTE_BEFORE_CHANGE](state, payload) {
      if (payload) {
        const { from, to } = payload;
        state.historyMode = state.historyMode === 'triggered'
          ? 'history'
          : null;
        if (!state.entry) {
          state.entry = routeClone(to);
        }
        state.from = routeClone(from);
        state.to = routeClone(to);
      }
    },
    [COMMON.ROUTE_CHANGE](state, payload) {
      if (payload) {
        const { from, to } = payload;
        if (!state.entry) {
          state.entry = routeClone(to);
        }
        state.from = routeClone(from);
        state.to = routeClone(to);
        state.current = routeClone(to);
      }
    },
    [COMMON.ROUTE_HISTORY_MODE](state) {
      state.historyMode = 'triggered';
    },
  },
};
