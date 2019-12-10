/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import cookie from 'js-cookie';

export const get = <T = unknown>(k, opt = {}): T | undefined => cookie.get(k, Object.assign({ path: process.env.PUBLIC_PATH }, opt));
export const set = (k, v, opt = {}): void => cookie.set(k, v, Object.assign({ path: process.env.PUBLIC_PATH }, opt));
export const remove = (k, opt = {}): void => cookie.remove(k, Object.assign({ path: process.env.PUBLIC_PATH }, opt));
export const clear = (): void => { Object.keys(cookie.get()).forEach(v => cookie.remove(v)); };
