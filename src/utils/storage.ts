/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as cookie from './cookie';

export const setLocal = (k, v): void => (
  window.localStorage
    ? window.localStorage.setItem(k, JSON.stringify(v))
    : (cookie.remove(k), cookie.set(k, JSON.stringify(v)))
);
export const getLocal = <T = unknown>(k): T | undefined => {
  const raw = window.localStorage ? window.localStorage.getItem(k) : cookie.get<string>(k);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return void 0;
};
export const removeLocal = (k): void => (window.localStorage ? window.localStorage.removeItem(k) : cookie.remove(k));
export const clearLocal = (): void => (window.localStorage ? window.localStorage.clear() : cookie.clear());
