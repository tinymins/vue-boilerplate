/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import axios from 'axios';
import { BASE_API_URL, SLOW_API_TIME, MAX_API_RETRY_COUNT, MULTI_REQUEST_URL, CAMELIZE_API_RESPONSE, AUTH_STATE_LIST } from '@/config';
import { singletonPromise, navigateLocation } from '@/utils/util';
import { isDevelop } from '@/utils/environment';
import { checkAuthorizeRedirect, getAuthorization } from '@/utils/authorization';
import { camelize, parseNavLocation } from '@/utils/transfer';
import store from '@/store';
import { COMMON } from '@/store/types';
import { showDialog } from '@/store/utils';
import router from '@/router';

const showToast = ({ text, time = 2000, type = 'warn' }) => store && store.commit(`common/${COMMON.PUSH_TOAST}`, { text, time, type });
const showMessageBox = (title, content, buttons) => showDialog({ title, content, buttons });

const getRequestId = config => `api:axios#${config.requestCount}`;
const showRequestLoading = (config, text) => store && store.commit(`common/${COMMON.SHOW_LOADING}`, { id: getRequestId(config), text });
const hideRequestLoading = config => store && store.commit(`common/${COMMON.HIDE_LOADING}`, { id: getRequestId(config) });

export const http = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

const slowRequest = [];
const timerIndicator = [];
const requestStartTime = [];
const onRequestSlowly = (config) => {
  const index = timerIndicator.findIndex(p => p.config === config);
  if (index >= 0) {
    timerIndicator.splice(index, 1);
  }
  showRequestLoading(config);
  slowRequest.push(config);
};
const autoShowRequestLoading = (config) => {
  if (config.modal) {
    showRequestLoading(config);
  } else {
    if (config.silent || config.showMask === false) {
      return;
    }
    if (requestStartTime.some(p => (new Date()).valueOf() - p.time >= SLOW_API_TIME)) {
      showRequestLoading(config);
      slowRequest.push(config);
    } else {
      timerIndicator.push({
        config,
        timer: setTimeout(onRequestSlowly, SLOW_API_TIME, config),
      });
    }
  }
  requestStartTime.push({ config, time: (new Date()).valueOf() });
};
const autoHideRequestLoading = (config) => {
  // Make loading display 50ms longer in order to avoid multiple api loading flashing one by one.
  setTimeout(() => {
    if (config.modal) {
      hideRequestLoading(config);
    } else {
      if (config.silent || config.showMask === false) {
        return;
      }
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
  if (error.config.maxRetry > 0) {
    error.config.maxRetry -= 1;
    showToast({ text: '网络错误，正在尝试重新连接…' });
    return http.request(error.config);
  }
  return Promise.reject(error);
};

export const onResponse = (res) => {
  autoHideRequestLoading(res.config);
  if (res.data && CAMELIZE_API_RESPONSE) {
    camelize(res.data, { modify: true });
  }
  const dialog = res.data.dialog;
  if (dialog) {
    showMessageBox(dialog.title, dialog.message, dialog.buttons.map(item => ({
      label: item.label,
      action: () => {
        if (item.go) {
          const location = parseNavLocation(item.go);
          if (location) {
            navigateLocation(location, router);
          }
        }
      },
      primary: item.primary,
    })));
  }
  const toast = res.data.toast;
  if (toast) {
    showToast({ text: toast.message, time: toast.time, type: toast.type });
  }
  return Promise.resolve(res);
};

const onResponseErrorCode = async ({ response, config, stack: errorStack = '' }) => {
  const isAuthStatus = !config.ignoreAuth && AUTH_STATE_LIST.includes(response.data.errcode);
  if (isAuthStatus) {
    const status = await getAuthorization('local');
    if (status !== response.data.errcode) {
      await getAuthorization('reload');
    }
    const { route } = router.resolve(store.state.common.route.to.fullPath);
    const redirect = await checkAuthorizeRedirect(route);
    if (redirect) {
      router.push(redirect);
      return;
    }
  }
  const errcode = response.data.errcode;
  const silent = config.silent || config.showError === false
    || (config.ignoreAuth && AUTH_STATE_LIST.includes(errcode))
    || config.errcodeExpected.includes(errcode);
  if (!silent) {
    if (errcode >= 500) {
      const errmsg = response && response.data && response.data.errmsg
        ? response.data.errmsg
        : errorStack;
      showMessageBox(`服务器错误 ${errcode}`, errmsg || '未知错误');
    } else if (errcode >= 400) {
      if (isDevelop()) {
        showMessageBox(`请求失败 ${errcode}`, response.data.errmsg || 'No errmsg.');
      } else {
        showToast({ text: response.data.errmsg || '未知错误', position: 'center' });
      }
    } else {
      showMessageBox(`异常 ${errcode}`, '未知Response错误');
    }
  }
};

export const onResponseError = (error) => {
  autoHideRequestLoading(error.config);
  if (error.response) {
    if (error.response.data && CAMELIZE_API_RESPONSE) {
      camelize(error.response.data, { modify: true });
    }
    onResponseErrorCode(error);
  } else {
    if (error.config.maxRetry > 0) {
      error.config.maxRetry -= 1;
      showToast({ text: '网络错误，正在尝试重新连接…' });
      return http.request(error.config);
    }
    if (isDevelop()) {
      showMessageBox(error.message, error.stack);
    } else if (!error.config.silent && error.config.showError) {
      if (error.code === 'ECONNABORTED') {
        showToast({ text: '网络错误，数据加载失败！' });
      } else {
        showToast({ text: error.message });
      }
    }
  }
  return Promise.reject(error);
};

const hookMethods = (hook) => {
  const raws = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
  };
  ['get', 'post', 'put', 'delete'].forEach((type) => { http[type] = hook(raws[type], type.toUpperCase()); });
};

{ // transfer arguments
  const raw = Object.assign({}, http);
  http.get = (url, params, options, ...extra) =>
    raw.get(url, Object.assign({}, options, { params }), ...extra);
  http.delete = (url, params, options, ...extra) =>
    raw.delete(url, Object.assign({}, options, { params }), ...extra);
}

if (MULTI_REQUEST_URL) {
  // Merge multiple request into one for better loading speed.
  // If only one request in request list, raw method will be
  // called instead of merged api. Notice that this api do not
  // support file uploads.
  const raw = {
    GET: http.get,
    POST: http.post,
    PUT: http.put,
    DELETE: http.delete,
  };
  const multiRequests = [];
  let timerMultiRequest = 0;
  const rawRequest = info =>
    raw[info.method](info.url, info.params, info.options, ...info.extra);
  const runMultiRequest = () => {
    if (multiRequests.length === 0) {
      return;
    }
    const infos = multiRequests.splice(0);
    if (infos.length === 1) {
      const info = infos[0];
      rawRequest(info)
        .then(info.resolve)
        .catch(info.reject);
      return;
    }
    const modal = infos.some(p => p.options.modal);
    const silent = !infos.some(p => !p.options.silent);
    const showMask = infos.some(p => p.options.showMask);
    const showError = infos.some(p => p.options.showError);
    const maxRetry = Math.max(...infos.map(p => p.options.maxRetry));
    const ignoreAuth = !infos.some(p => !p.options.ignoreAuth);
    const errcodeExpected = [].concat(...infos.map(p => p.options.errcodeExpected)).filter(_ => _);
    raw.POST(MULTI_REQUEST_URL, infos.map(p => ({
      method: p.method,
      uri: p.url,
      data: p.params,
    })), { modal, silent, showMask, showError, maxRetry, ignoreAuth, errcodeExpected }).then((response) => {
      response.data.data.forEach((res, index) => {
        const info = infos[index];
        const status = res.errcode === 0 ? 200 : res.errcode;
        if (status >= 200 && status < 300) {
          info.resolve({ status, data: res });
        } else {
          onResponseErrorCode({
            config: info.options,
            response: { status, data: res },
          });
          info.reject({ response: { status, data: res } });
        }
      });
    }).catch((err) => {
      infos.forEach(p => p.reject(err));
    });
    timerMultiRequest = 0;
  };
  const multiRequest = ({ method, url, params, options, extra }) => {
    if (params instanceof FormData) {
      return rawRequest({ method, url, params, options, extra });
    }
    return new Promise((resolve, reject) => {
      multiRequests.push({ method, resolve, reject, url, params, options, extra });
      if (timerMultiRequest) {
        clearTimeout(timerMultiRequest);
      }
      timerMultiRequest = setTimeout(runMultiRequest, 5);
    });
  };
  hookMethods((_, method) => (url, params, options, ...extra) =>
    multiRequest({ method, url, params, options, extra }));
}

// Auto timestamp // must after request merge and null/undefined params removed
hookMethods(raw => (url, params, options, ...extra) =>
  raw(url, params instanceof FormData ? params : Object.assign({ _: (new Date()).valueOf() }, params), options, ...extra));

// Merge same requests which has the same url and params.
hookMethods(raw => singletonPromise(raw, (url, params) => (params instanceof FormData ? null : { url, params })));

{ // Remove null or undefined in params
  const removeObjectNull = (obj) => {
    if (!obj) {
      return obj;
    }
    const data = {};
    Object.keys(obj).forEach((k) => {
      if (obj[k] !== null && obj[k] !== void 0) {
        data[k] = obj[k];
      }
    });
    return data;
  };
  hookMethods(raw => (url, params, ...extra) =>
    raw(url, params instanceof FormData ? params : removeObjectNull(params), ...extra));
}

// Fill all arguments, return only data
// Must be the last hook, otherwise params and return values will get wrong order
hookMethods(raw => (url, params = {}, options = {}, ...extra) => new Promise((resolve, reject) => {
  raw(url, params, Object.assign({
    modal: false,
    silent: false,
    showMask: true,
    showError: true,
    maxRetry: MAX_API_RETRY_COUNT,
    ignoreAuth: false,
    errcodeExpected: [],
  }, options), ...extra)
    .then(res => resolve(res.data))
    .catch((err) => {
      if (err.response) {
        err.response = err.response.data;
      }
      reject(err);
    });
}));

http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
