/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */
import store from '@/store';

export const setHeaderTitle = (...args) => store.commit('common/COMMON_SET_HEADER_TITLE', ...args);
export const showLoading = ({ id = Symbol('Loading'), text } = {}) => {
  store.commit('common/COMMON_SHOW_LOADING', { id, text });
  return id;
};
export const hideLoading = ({ id }) => store.commit('common/COMMON_HIDE_LOADING', { id });
export const pushToast = (...args) => store.commit('common/COMMON_PUSH_TOAST', ...args);
export const popToast = (...args) => store.commit('common/COMMON_POP_TOAST', ...args);
export const pushMessage = (...args) => store.commit('common/COMMON_PUSH_MESSAGE', ...args);
export const popMessage = (...args) => store.commit('common/COMMON_POP_MESSAGE', ...args);
export const pushActionsheet = (...args) => store.commit('common/COMMON_PUSH_ACTIONSHEET', ...args);
export const popActionsheet = (...args) => store.commit('common/COMMON_POP_ACTIONSHEET', ...args);

const install = (Vue) => {
  Object.entries({
    setHeaderTitle,
    showLoading,
    hideLoading,
    pushToast,
    popToast,
    pushMessage,
    popMessage,
    pushActionsheet,
    popActionsheet,
  }).forEach(([k, v]) => {
    Vue[k] = v;
    Vue.prototype[`$${k}`] = v;
  });
};

export default { install };
