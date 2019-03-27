/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
 */

import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export interface ApiPromise<T = any> extends Promise<ApiResponse<T>> {
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  modal?: boolean,
  silent?: boolean,
  showMask?: boolean,
  showError?: boolean,
  maxRetry?: number,
  ignoreAuth?: boolean,
  errcodeExpected?: number[],
}

export interface ApiInstance {
  get<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiPromise<T>;
  delete(url: string, data?: any, config?: ApiRequestConfig): ApiPromise;
  post<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiPromise<T>;
  put<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiPromise<T>;
}

export declare const http: ApiInstance;
