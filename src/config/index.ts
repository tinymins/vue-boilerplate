/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { isInDevMode } from '@/utils/environment';

export const SLOW_API_TIME = 300;
export const MAX_API_RETRY_COUNT = 3;
export const CAMELIZE_API_RESPONSE = true;
export const AUTH_STATE = {
  LOGGED_IN: 0,
  GUEST: 401,
  BLOCKED: 403,
  UNREGISTERED: 448,
};
export const AUTH_STATE_LIST = Object.values(AUTH_STATE);
export const AUTH_REDIRECT = {
  [AUTH_STATE.LOGGED_IN]: 'index',
  [AUTH_STATE.GUEST]: 'user_login',
  [AUTH_STATE.BLOCKED]: '403',
  [AUTH_STATE.UNREGISTERED]: 'user_welcome',
};
export const BASE_HOST = process.env.API_GATEWAY ? process.env.API_GATEWAY : window.location.origin;
export const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
export const ICON_URL = 'https://haiman.io/img/logo.png';
export const BASE_API_URL = `${BASE_HOST}/api`;
export const WECHAT_AUTH_URL = `${BASE_API_URL}/authorize?mode={{reason}}&service={{service}}&redirect_uri={{redirect}}`;
export const MULTI_REQUEST_URL = process.env.NODE_ACTION === 'build' && !isInDevMode('manually') ? 'multi-requests' : null;
