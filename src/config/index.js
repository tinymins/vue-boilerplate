/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { isRun, isLocalhost, isProdDatabase } from '@/utils/environment';

export const SLOW_API_TIME = 300;
export const MAX_API_RETRY_COUNT = 3;
export const CAMELIZE_API_RESPONSE = true;
export const AUTH_STATE = {
  NORMAL: 200,
  GUEST: 401,
};
export const AUTH_REDIRECT = {
  [AUTH_STATE.NORMAL]: 'index',
  [AUTH_STATE.GUEST]: 'user_login',
};
export const BASE_HOST = (() => {
  if (isLocalhost()) {
    return 'https://dev.haimanchajian.com/';
  }
  return `${window.location.origin}/`;
})();
export const ICON_URL = 'https://haiman.io/img/logo.png';
export const BASE_API_URL = isRun() && isLocalhost() && !isProdDatabase() ? `${window.location.origin}/api` : `${BASE_HOST}api`;
export const WECHAT_AUTH_URL = `${BASE_API_URL}/authorize?mode={{reason}}&service={{service}}&redirect_uri={{redirect}}`;
export const MULTI_REQUEST_URL = process.env.NODE_ACTION === 'build' ? 'multi-requests' : null;
