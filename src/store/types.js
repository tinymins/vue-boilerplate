/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:00
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 12:05:57
*/
/* eslint function-paren-newline: "off" */

const exportVar = (enumerate, ...args) => {
  const data = {};
  const type = [].concat(...args);
  type.forEach((action) => {
    data[action] = `${enumerate}_${action}`;
  });
  return data;
};

export const COMMON = exportVar('COMMON',
  'SHOW_LOADING', 'HIDE_LOADING',
  'PUSH_TOAST', 'POP_TOAST',
  'PUSH_MESSAGE', 'POP_MESSAGE',
  'SAVE_SCROLL',
);
export const USER = exportVar('USER',
  'GET', 'LOGIN', 'LOGOUT', 'CLEAR',
);
export const SECRET = exportVar('SECRET',
  'LIST_REQUEST', 'LIST_SUCCESS', 'LIST_FAILURE', 'POSTS',
);
