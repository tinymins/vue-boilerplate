/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import { isInDevMode } from '@/utils/environment';

import { type StoreCommonGetters, type StoreCommonState, storeCommonModule } from './common';
import { type StoreUserGetters, type StoreUserState, storeUserModule } from './user';

export type { ExtractModuleState, ExtractModuleGetter, ExtractModuleAction, ExtractModuleMutation } from './types';

Vue.use(Vuex);

export interface StoreRootState {
  common: StoreCommonState;
  user: StoreUserState;
}

export interface StoreRootGetters {
  common: StoreCommonGetters;
  user: StoreUserGetters;
}

export type StoreInstance = Store<StoreRootState>;

const createStore = (): Store<StoreRootState> => new Vuex.Store<StoreRootState>({
  strict: isInDevMode(),
  modules: {
    common: storeCommonModule,
    user: storeUserModule,
  },
});

export default createStore;
