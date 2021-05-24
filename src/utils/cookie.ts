/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import cookie from 'js-cookie';

export const get = <T = unknown>(k: string): T | undefined => {
  try {
    const s = cookie.get(k);
    if (s) {
      return JSON.parse(s);
    }
  } catch {}
  return void 0;
};

export const set = <T = unknown>(k: string, v: T, opt: cookie.CookieAttributes = {}): void => {
  cookie.set(k, JSON.stringify(v), Object.assign({ path: '/' }, opt));
};

export const remove = (k: string, opt: cookie.CookieAttributes = {}): void => {
  cookie.remove(k, Object.assign({ path: '/' }, opt));
};

export const clear = (): void => {
  for (const v of Object.keys(cookie.get())) {
    cookie.remove(v);
  }
};
