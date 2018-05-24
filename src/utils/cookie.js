/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-12-04 14:02:25
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 10:37:47
 */
import cookie from 'cookie';
import BASE_ROUTE from '@/config/base-route';

export const get = (k, opt = {}) => cookie.get(k, Object.assign({ path: BASE_ROUTE }, opt));
export const set = (k, v, opt = {}) => cookie.set(k, v, Object.assign({ path: BASE_ROUTE }, opt));
export const remove = (k, opt = {}) => cookie.remove(k, Object.assign({ path: BASE_ROUTE }, opt));
