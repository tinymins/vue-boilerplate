/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

let enumerateCount = 0;
const exportVar = (enumerate, type) => {
  const data = {};
  type.forEach((action) => {
    enumerateCount += 1;
    data[action] = process.env.NODE_ENV === 'development' ? `${enumerate}.${action}` : `${enumerateCount}`;
  });
  return data;
};

export const COMMON = exportVar('COMMON', [
  'SAVE_SCROLL',
  'SHOW_LOADING', 'HIDE_LOADING',
  'SHOW_TOAST', 'HIDE_TOAST',
  'SHOW_DIALOG', 'HIDE_DIALOG',
  'SHOW_ACTIONSHEET', 'HIDE_ACTIONSHEET',
  'ROUTE_BEFORE_CHANGE', 'ROUTE_CHANGE', 'ROUTE_HISTORY_MODE',
  'SET_BODY_SCROLLABLE', 'REMOVE_BODY_SCROLLABLE',
  'SET_BODY_AUTO_HEIGHT', 'REMOVE_BODY_AUTO_HEIGHT',
  'SET_BODY_BACKGROUND', 'REMOVE_BODY_BACKGROUND',
  'SET_HEADER_TITLE', 'SET_VIEWPORT_SIZE',
  'SET_HEADER_HEIGHT', 'SET_HEADER_EXTRA_HEIGHT', 'REMOVE_HEADER_EXTRA_HEIGHT',
  'SET_TABBAR_HEIGHT', 'SET_FOOTER_EXTRA_HEIGHT', 'REMOVE_FOOTER_EXTRA_HEIGHT',
  'SET_NAVBAR_VISIBLE', 'REMOVE_NAVBAR_VISIBLE',
  'SET_TABBAR_VISIBLE', 'REMOVE_TABBAR_VISIBLE',
  'GET_WECHAT_SDK_INFO', 'SET_WECHAT_SHARE',
]);

export const USER = exportVar('USER', [
  'GET', 'LOGIN', 'LOGOUT',
]);
