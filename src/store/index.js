/*
* @Author: William Chan
* @Date:   2017-05-03 15:30:50
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 00:29:56
*/

import Vue from 'vue';
import Vuex from 'vuex';
import { isDevelop } from '@/utils/environment';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from '@/store/mutations';
import commonModule from '@/store/modules/common';
import userModule from '@/store/modules/user';
import secretModule from '@/store/modules/secret';

Vue.use(Vuex);
const store = new Vuex.Store({
  strict: isDevelop(),
  // state,
  // getters,
  // actions,
  // mutations,
});

store.registerModule('common', commonModule);
store.registerModule('user', userModule);
store.registerModule('secret', secretModule);

export default store;
