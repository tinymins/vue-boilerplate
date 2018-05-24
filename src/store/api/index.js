/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import qs from 'qs';
import axios from 'axios';
import { isDevelop, isInMobileDevice } from '@/utils/environment';
import store from '@/store';

export const API_HOST = isDevelop() ? 'https://dev.haimanchajian.com/api' : '/api';

const showToast = (text, time = 2000, type = 'warning') => store && store.commit('common/COMMON_PUSH_TOAST', { text, time, type });
const showMessageBox = (title, content) => store && store.commit('common/COMMON_PUSH_MESSAGE', { title, content });

const getRequestId = config => `api:axios#${config.requestCount}`;
const getLoadingText = config => `Connecting ${config.url.replace(/.*:\/\//, '').replace(/\/.*/, '')}${config.loadingText ? ` | ${config.loadingText}` : ''}`;
const showRequestLoading = (config, text) => store && store.commit('common/COMMON_SHOW_LOADING', { id: getRequestId(config), text });
const hideRequestLoading = config => store && store.commit('common/COMMON_HIDE_LOADING', { id: getRequestId(config) });


window.onerror = (msg) => {
// window.onerror = (msg, url, lineNo, columnNo, error) => {
  showMessageBox('JavaScript catch', msg);
  return false;
};

let requestCount = 0;
export const onRequest = (req) => {
  if (req.interceptors !== false) {
    req.interceptors = true;
  }
  requestCount += 1;
  req.requestCount = requestCount;
  showRequestLoading(req, getLoadingText(req));
  return req;
};

export const onRequestError = error => Promise.reject(error);

export const onResponse = (res) => {
  hideRequestLoading(res.config);
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  hideRequestLoading(error.config);
  if (!error.response) {
    showMessageBox(error.message, error.stack);
  } else if (error.response.status === 401) {
      // clearAuthorization();
  } else if (error.response.status >= 500) {
    showMessageBox(`Server error: ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    showMessageBox(`Request failed: ${error.response.status}`, error.response.data.errmsg || 'no errmsg');
  } else {
    showMessageBox(`Exception: ${error.response.status}`, 'Unknown response error');
  }
  return Promise.reject(error);
};

export const openIndicator = (...params) => { showRequestLoading(...params); };
export const closeIndicator = (...params) => { hideRequestLoading(...params); };

export const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  timeout: !isDevelop() && 10000,
});

http.postForm = (url, data, ...params) => http.post(url, qs.stringify(data), ...params);
http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
