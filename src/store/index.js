/*
* @Author: William Chan
* @Date:   2017-05-03 15:30:50
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 00:29:56
*/

import Vue from 'vue';
import Vuex from 'vuex';
import { isDevelop } from '@/utils/util';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from '@/store/mutations';
import userModule from '@/store/modules/user';
import secretModule from '@/store/modules/secret';

Vue.use(Vuex);
export const store = new Vuex.Store({
  strict: isDevelop(),
  // state,
  // getters,
  // actions,
  // mutations,
});

store.registerModule('user', userModule);
store.registerModule('secret', secretModule);

export const clearAuthorization = () => {
  store.dispatch('user/USER_CLEAR');
};

export const getAuthorization = async () => {
  if (!store.state.user.user) {
    await store.dispatch('user/USER_GET');
  }
  return store.getters['user/user'];
};
