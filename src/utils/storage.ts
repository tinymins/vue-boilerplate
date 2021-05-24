/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as cookie from './cookie';

export const getLocal = <T = unknown>(k: string): T | undefined => {
  const raw = window.localStorage ? window.localStorage.getItem(k) : cookie.get<string>(k);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return void 0;
};

export const setLocal = <T = unknown>(k: string, v: T): void => {
  if (window.localStorage) {
    window.localStorage.setItem(k, JSON.stringify(v));
  } else {
    cookie.remove(k);
    cookie.set(k, JSON.stringify(v));
  }
};

export const removeLocal = (k: string): void => {
  if (window.localStorage) {
    window.localStorage.removeItem(k);
  } else {
    cookie.remove(k);
  }
};

export const clearLocal = (): void => {
  if (window.localStorage) {
    window.localStorage.clear();
  } else {
    cookie.clear();
  }
};

const checkUser = (user: unknown): true | undefined => {
  if (typeof user !== 'string') {
    throw new TypeError('User must be a string value.');
  }
  if (!user) {
    throw new Error('User cannot be empty.');
  }
  return true;
};

export const getUserLocal = <T = unknown>(user: string, k: string): T | undefined => checkUser(user) && getLocal<T>(`@user/${user}/${k}`);
export const setUserLocal = <T = unknown>(user: string, k: string, v: T): void => checkUser(user) && setLocal<T>(`@user/${user}/${k}`, v);
export const removeUserLocal = (user: string, k: string): void => checkUser(user) && removeLocal(`@user/${user}/${k}`);
