/*
* @Author: William Chan
* @Date:   2017-05-03 15:30:50
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 18:46:27
*/

import Vue from 'vue';
import Vuex from 'vuex';
import { isDevelop } from '@/utils/util';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from '@/store/mutations';
import userModule from '@/store/modules/user';

Vue.use(Vuex);
export const store = new Vuex.Store({
  strict: isDevelop(),
  // state,
  // getters,
  // actions,
  // mutations,
});

store.registerModule('user', userModule);

export const clearAuthorization = () => {
  store.dispatch('user/USER_CLEAR');
};

export const getAuthorization = async () => {
  if (!store.state.user.user) {
    await store.dispatch('user/USER_GET');
  }
  return store.getters['user/user'];
};
