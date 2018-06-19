/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-12-13 2:58:06
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
import * as cookie from './cookie';

export const setLocal = (k, v) => (
  window.localStorage
    ? window.localStorage.setItem(k, JSON.stringify(v))
    : (cookie.remove(k), cookie.set(k, JSON.stringify(v)))
);
export const getLocal = (k) => {
  const raw = window.localStorage ? window.localStorage.getItem(k) : cookie.get(k);
  try {
    return JSON.parse(raw);
  } catch (e) {
    return undefined;
  }
};
export const removeLocal = k => (window.localStorage ? window.localStorage.removeItem(k) : cookie.remove(k));
