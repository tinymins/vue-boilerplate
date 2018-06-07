/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import qs from 'qs';
import axios from 'axios';
import { BASE_API_HOST, SLOW_API_TIME, MAX_API_RETRY_COUNT } from '@/config';
import { singletonPromise } from '@/utils/util';
import { isDevelop } from '@/utils/environment';
import store from '@/store';

const showToast = (text, time = 2000, type = 'warning') => store && store.commit('common/COMMON_PUSH_TOAST', { text, time, type });
const showMessageBox = (title, content) => store && store.commit('common/COMMON_PUSH_MESSAGE', { title, content });

const getRequestId = config => `api:axios#${config.requestCount}`;
const getLoadingText = config => `Connecting ${config.url.replace(/.*:\/\//, '').replace(/\/.*/, '')}${config.loadingText ? ` | ${config.loadingText}` : ''}`;
const showRequestLoading = (config, text) => store && store.commit('common/COMMON_SHOW_LOADING', { id: getRequestId(config), text });
const hideRequestLoading = config => store && store.commit('common/COMMON_HIDE_LOADING', { id: getRequestId(config) });

export const http = axios.create({
  baseURL: BASE_API_HOST,
  withCredentials: true,
  timeout: 30000,
});
http.postForm = (url, data, ...params) => http.post(url, qs.stringify(data), ...params);

const slowRequest = [];
const timerIndicator = [];
const requestStartTime = [];
const onRequestSlowly = (config) => {
  const index = timerIndicator.findIndex(p => p.config === config);
  if (index >= 0) {
    timerIndicator.splice(index, 1);
  }
  showRequestLoading(config, getLoadingText(config));
  slowRequest.push(config);
};
const autoShowRequestLoading = (config) => {
  if (config.silent) {
    return;
  }
  if (config.modal) {
    showRequestLoading(config, getLoadingText(config));
  } else if (requestStartTime.some(p => (new Date()).valueOf() - p.time >= SLOW_API_TIME)) {
    showRequestLoading(config, getLoadingText(config));
    slowRequest.push(config);
  } else {
    timerIndicator.push({
      config,
      timer: setTimeout(onRequestSlowly, SLOW_API_TIME, config),
    });
  }
  requestStartTime.push({ config, time: (new Date()).valueOf() });
};
const autoHideRequestLoading = (config) => {
  if (config.silent) {
    return;
  }
  setTimeout(() => {
    if (config.modal) {
      hideRequestLoading(config);
    } else {
      const timerIndex = timerIndicator.findIndex(p => p.config === config);
      if (timerIndex >= 0) {
        clearTimeout(timerIndicator.splice(timerIndex, 1)[0].timer);
      } else {
        const slowIndex = slowRequest.findIndex(p => p === config);
        if (slowIndex >= 0) {
          hideRequestLoading(config);
          slowRequest.splice(slowIndex, 1);
        }
      }
    }
    const requestStartTimeIndex = requestStartTime.findIndex(p => p.config === config);
    if (requestStartTimeIndex >= 0) {
      requestStartTime.splice(requestStartTimeIndex, 1);
    }
  }, 50);
};

if (isDevelop()) {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
  // window.onerror = (msg, url, lineNo, columnNo, error) => {
    showMessageBox('JavaScript catch', `[MSG]:${msg} [URL]${url} [POS]${lineNo},${columnNo} [ERROR]:${error}`);
    return false;
  };
}

let requestCount = 0;
export const onRequest = (req) => {
  if (req.interceptors !== false) {
    req.interceptors = true;
  }
  requestCount += 1;
  req.requestCount = requestCount;
  autoShowRequestLoading(req);
  return req;
};

export const onRequestError = (error) => {
  autoHideRequestLoading(error.config);
  if (error.config.retryCount < MAX_API_RETRY_COUNT) {
    error.config.retryCount += 1;
    return http.request(error.config);
  }
  return Promise.reject(error);
};

export const onResponse = (res) => {
  autoHideRequestLoading(res.config);
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  autoHideRequestLoading(error.config);
  if (!error.response) {
    if (isDevelop()) {
      showMessageBox(error.message, error.stack);
    } else if (!error.config.silent) {
      if (error.code === 'ECONNABORTED') {
        showToast({ text: 'Network error!' });
      } else {
        showToast({ text: error.message });
      }
    }
    showMessageBox(error.message, error.stack);
  } else if (error.response.status === 401) {
    // clearAuthorization();
  } else if (error.response.status >= 500) {
    showMessageBox(`Server error: ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    if (isDevelop()) {
      showMessageBox(`Request failed: ${error.response.status}`, error.response.data.errmsg || 'no errmsg');
    } else {
      showToast({ text: error.response.data.errmsg || 'Unknown error', position: 'center' });
    }
  } else {
    showMessageBox(`Exception: ${error.response.status}`, 'Unknown response error');
  }
  if (!error.response && error.config.retryCount < MAX_API_RETRY_COUNT) {
    error.config.retryCount += 1;
    return http.request(error.config);
  }
  return Promise.reject(error);
};

// Merge same requests which has the same url and params.
http.get = singletonPromise(http.get, (url, { params } = {}) => ({ url, params }));
http.post = singletonPromise(http.post, (url, data) => (data instanceof FormData ? null : { url, data }));
http.put = singletonPromise(http.put, (url, data) => ({ url, data }));
http.delete = singletonPromise(http.delete, (url, { params } = {}) => ({ url, params }));

http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
