/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import uuidv1 from 'uuid/v1';
import store from '@/store';
import { COMMON } from '@/store/types';

export const setHeaderTitle = (...args) => store.commit(`common/${COMMON.SET_HEADER_TITLE}`, ...args);
export const setWechatShare = (...args) => store.commit(`common/${COMMON.SET_WECHAT_SHARE}`, ...args);
export const setFooterExtraHeight = (...args) => store.commit(`common/${COMMON.SET_FOOTER_EXTRA_HEIGHT}`, ...args);
export const removeFooterExtraHeight = (...args) => store.commit(`common/${COMMON.REMOVE_FOOTER_EXTRA_HEIGHT}`, ...args);
export const setHeaderExtraHeight = (...args) => store.commit(`common/${COMMON.SET_HEADER_EXTRA_HEIGHT}`, ...args);
export const removeHeaderExtraHeight = (...args) => store.commit(`common/${COMMON.REMOVE_HEADER_EXTRA_HEIGHT}`, ...args);

export const showLoading = ({ id = Symbol('Loading'), text } = {}) => {
  store.commit(`common/${COMMON.SHOW_LOADING}`, { id, text });
  return id;
};
export const hideLoading = ({ id }) => store.commit(`common/${COMMON.HIDE_LOADING}`, { id });

export const showToast = ({ id = uuidv1(), ...params }, ...args) => {
  store.commit(`common/${COMMON.SHOW_TOAST}`, { ...params, id }, ...args);
  return id;
};
export const hideToast = (...args) => store.commit(`common/${COMMON.HIDE_TOAST}`, ...args);

export const showDialog = ({ id = uuidv1(), ...params }, ...args) => {
  store.commit(`common/${COMMON.SHOW_DIALOG}`, { ...params, id }, ...args);
  return id;
};
export const hideDialog = (...args) => store.commit(`common/${COMMON.HIDE_DIALOG}`, ...args);

export const showActionsheet = ({ id = uuidv1(), ...params }, ...args) => {
  store.commit(`common/${COMMON.SHOW_ACTIONSHEET}`, { ...params, id }, ...args);
  return id;
};
export const hideActionsheet = (...args) => store.commit(`common/${COMMON.HIDE_ACTIONSHEET}`, ...args);

const install = (Vue) => {
  Object.entries({
    setHeaderTitle,
    setWechatShare,
    setFooterExtraHeight,
    removeFooterExtraHeight,
    setHeaderExtraHeight,
    removeHeaderExtraHeight,
    showLoading,
    hideLoading,
    showToast,
    hideToast,
    showDialog,
    hideDialog,
    showActionsheet,
    hideActionsheet,
  }).forEach(([k, v]) => {
    Vue[k] = v;
    Vue.prototype[`$${k}`] = v;
  });
};

export default { install };
