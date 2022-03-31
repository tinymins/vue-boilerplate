/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import get from 'lodash/get';
import { BASE_API_URL, MAX_API_RETRY_COUNT, MULTI_REQUEST_URL, SLOW_API_TIME } from '@/config';
import { RouterInstance } from '@/router';
import { StoreInstance } from '@/store';
import { EntryParams } from '@/types';
import * as IS from '@/utils/is';
import createApi, { HttpError } from '../create-api';

export * from '../create-api';

export const APIServiceBasicResponse = IS.interface({});
export type APIServiceBasicResponse = IS.TypeOf<typeof APIServiceBasicResponse>;

export default (store: StoreInstance, router: RouterInstance, headers?: EntryParams['headers']) => createApi<APIServiceBasicResponse>({
  store,
  router,
  headers,
  options: {
    baseUrl: BASE_API_URL,
    multiRequestURL: MULTI_REQUEST_URL,
    tardyRequestTime: SLOW_API_TIME,
    maxRetry: MAX_API_RETRY_COUNT,
  },
  rawResponseMapper: (response) => {
    const data = response.data;
    // special for api services
    response.status = get(data, 'errcode', response.status);
    response.message = get(data, 'errmsg', response.message);
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
    const errMsg = !response.message || response.message.toUpperCase() === 'OK'
      ? '服务器或者网络发生错误，请稍后再试！'
      : response.message;
    console.error(errMsg);
    return;
  }
  console.error(response?.data
    ? `后端异常：${response.message || '未知故障'}`
    : '请求失败：网络错误或后端无响应');
};
