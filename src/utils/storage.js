/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
