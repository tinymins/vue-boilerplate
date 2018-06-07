/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 19:32:30
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 14:45:10
 */
import { isLocalhost } from '@/utils/environment';

export const SLOW_API_TIME = 300;
export const MAX_API_RETRY_COUNT = 3;
export const BASE_HOST = (() => {
  if (isLocalhost()) {
    return 'https://dev.haimanchajian.com/';
  }
  return `${window.location.origin}/`;
})();
export const BASE_API_HOST = `${BASE_HOST}api`;
export const WECHAT_LOGIN_URL = '/api/authorize?mode=wx';
