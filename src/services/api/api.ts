/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import get from 'lodash/get';

import { EntryParams } from '@/types';
import { MAX_API_RETRY_COUNT, SLOW_API_TIME } from '@/config';
import { isInDevMode, isRun } from '@/utils/environment';
import * as IS from '@/utils/is';
import { type RouterInstance } from '@/router';
import { type StoreInstance } from '@/store';

import createApi, { HttpError } from '../create-api';

export * from '../create-api';

export const BACKEND_BASE_URL = isRun() ? window.location.origin : 'https://dev.haimanchajian.com';
export const BACKEND_API_URL = `${BACKEND_BASE_URL}/api`;
export const BACKEND_MULTI_REQUEST_URL = process.env.NODE_ACTION === 'build' && !isInDevMode('manually') ? 'multi-requests' : null;

export const BACKEND_WECHAT_AUTH_URL = `${BACKEND_API_URL}/authorize?mode={{reason}}&service={{service}}&redirect_uri={{redirect}}`;

export const APIServiceBasicResponse = IS.interface({});
export type APIServiceBasicResponse = IS.TypeOf<typeof APIServiceBasicResponse>;

export default (store: StoreInstance, router: RouterInstance, headers?: EntryParams['headers']) => createApi<APIServiceBasicResponse>({
  store,
  router,
  headers,
  options: {
    baseUrl: BACKEND_API_URL,
    multiRequestURL: BACKEND_MULTI_REQUEST_URL,
    tardyRequestTime: SLOW_API_TIME,
    maxRetry: MAX_API_RETRY_COUNT,
  },
  rawResponseMapper: (response) => {
    const data = response.data;
    // special for api services
    response.status = Number(get(data, 'errcode', response.status));
    response.statusText = String(get(data, 'errmsg', response.statusText));
    return response;
  },
});

export const apiServiceBasicResponseErrorHandler = (err: HttpError<APIServiceBasicResponse>) => {
  const request = err.request;
  const response = err.response;
  // 无请求或无返回，主要服务崩溃或者网络错误
  if (!request || !response) {
    console.error('服务器或者网络发生错误，请稍后再试!');
    return;
  }
  // 后端数据格式异常
  if (response.status === 555) {
    console.error(`后端数据格式异常 (${request.url}) `);
    return;
  }
  // 服务器错误
  if (response.status >= 500) {
    const errMsg = !response.statusText || response.statusText.toUpperCase() === 'OK'
      ? '服务器或者网络发生错误，请稍后再试！'
      : response.statusText;
    console.error(errMsg);
    return;
  }
  console.error(response?.data
    ? `后端异常：${response.statusText || '未知故障'}`
    : '请求失败：网络错误或后端无响应');
};
