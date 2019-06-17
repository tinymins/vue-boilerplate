/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { isInDevMode } from '@/utils/environment';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from './mutations';
import commonModule from './common';
import userModule from './user';

Vue.use(Vuex);
const store = new Vuex.Store({
  strict: isInDevMode(),
  // state,
  // getters,
  // actions,
  // mutations,
});

store.registerModule('common', commonModule);
store.registerModule('user', userModule);

export default store;
