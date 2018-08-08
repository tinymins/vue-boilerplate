/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
import cookie from 'cookie';
import { BASE_ROUTE } from '@/config/environment';

export const get = (k, opt = {}) => cookie.get(k, Object.assign({ path: BASE_ROUTE }, opt));
export const set = (k, v, opt = {}) => cookie.set(k, v, Object.assign({ path: BASE_ROUTE }, opt));
export const remove = (k, opt = {}) => cookie.remove(k, Object.assign({ path: BASE_ROUTE }, opt));
