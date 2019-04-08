/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Axios, { AxiosRequestConfig } from 'axios';
import { BASE_API_URL, SLOW_API_TIME, MAX_API_RETRY_COUNT, MULTI_REQUEST_URL, CAMELIZE_API_RESPONSE, AUTH_STATE_LIST } from '@/config';
import { navigateLocation } from '@/utils/util';
import { isDevelop } from '@/utils/environment';
import { checkAuthorizeRedirect, getAuthorization } from '@/utils/authorization';
import { camelize, parseNavLocation } from '@/utils/transfer';
import store from '@/store';
import { showDialog, showLoading, hideLoading, showToast, hideToast } from '@/store/utils';
import router from '@/router';
import Http, { HttpError, HttpRequestConfig, HttpPromise, HttpResponseData, HttpInterceptors } from './http';

/**
 * 打开加载框
 * @param {symbol} id 唯一标识符
 * @param {string} text 提示文字
 * @returns {void}
 */
const openIndicator = (id: symbol, text: string): any => showLoading({ id, text });

/**
 * 关闭加载框
 * @param {symbol} id 唯一标识符
 * @returns {void}
 */
const closeIndicator = (id: symbol): void => hideLoading({ id });

const axios = Axios.create({
  baseURL: '',
  withCredentials: true,
  timeout: 30000,
});

/**
 * 接管请求对象使用本地方法处理请求并返回结果
 * 注意：只要成功接收到服务器返回，无论返回码是多少都应该进入success回调。
 * @param {HttpRequestConfig} request 请求对象
 * @returns {HttpPromise} 请求异步等待
 */
const requestDriver = function requestDriver<T = any>(request: HttpRequestConfig): HttpPromise<T> {
  // // https://developers.weixin.qq.com/miniprogram/dev/api/api-network.html
  // if (config.useUploadFile) {
  //   request.name = data.name;
  //   request.filePath = data.filePath;
  //   return await WXP.uploadFile(request);
  // }
  // return await WXP.request(request);
  const axiosConfig: AxiosRequestConfig = {
    url: request.url,
    method: request.method,
    [request.method === 'PUT' || request.method === 'POST' || request.method === 'PATCH' ? 'data' : 'params']: request.data,
  };
  return new Promise((resolve, reject) => {
    const onResponse = (res): void => {
      let data = res.data;
      if (typeof res.data === 'string' && request.dataType === 'json') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      const response: HttpResponseData<T> = typeof data === 'object' && typeof data.errcode === 'number' && typeof data.errmsg === 'string'
        ? data
        : { data, errcode: res.status === 200 ? 0 : res.status, errmsg: 'OK' };
      resolve(response);
    };
    const onError = (error): void => {
      if (error && error.response) {
        onResponse(error.response);
      } else {
        reject(error);
      }
    };
    axios.request<T>(axiosConfig).then(onResponse).catch(onError);
  });
};

/**
 * @var {object} interceptors
 */
export const interceptors: HttpInterceptors = {
  onRequest(request) {
    // 追加 token
    const token = '';
    // const token = authorization.token;
    if (token) {
      request.header.Authorization = `Bearer ${token}`;
    }
    // 加入用户 referral 会造成这个请求变为状态请求
    if (request.needReferral && store.state.user.referral) {
      // 这里是后端需要 必须放到 query 中
      // 后端为了保证完整兼容性和一致性 使用的 $_GET 获取
      const symbol = request.url.indexOf('?') === -1 ? '?' : '&';
      request.url = `${request.url}${symbol}__from_uid=${store.state.user.referral}`;
    }
    // 显示加载中遮罩层
    if (request.modal) {
      openIndicator(request.id, '数据加载中');
    }
    return Promise.resolve(request);
  },
  onRequestTardy(request) {
    closeIndicator(request.id);
    if (request.showLoading) {
      openIndicator(request.id, '数据加载中');
    }
  },
  onRequestRetry() {
    hideToast({ id: 'http-error' });
    showToast({
      id: 'http-error',
      text: '网络错误，正在尝试重新连接…',
      time: 2000,
      type: 'error',
    });
  },
  onRequestError(error: HttpError) {
    showToast({
      id: 'http-error',
      text: '网络连接失败…',
      time: 2000,
      type: 'error',
    });
    closeIndicator(error.request.id);
    return Promise.reject(error);
  },
  onRequestSuccess(request) {
    hideToast({ id: 'http-error' });
    closeIndicator(request.id);
  },
  onResponse(res) {
    if (res.data && CAMELIZE_API_RESPONSE) {
      camelize(res.data, { modify: true });
    }
    const dialog = res.dialog;
    if (dialog) {
      showDialog({
        title: dialog.title,
        content: dialog.message,
        buttons: dialog.buttons.map(item => ({
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
        })),
      });
    }
    const toast = res.toast;
    if (toast) {
      showToast({
        text: toast.message,
        time: toast.time || 2000,
        type: toast.type || 'warn',
      });
    }
    return Promise.resolve(res);
  },
  async onResponseError(error) {
    const request = error.request;
    const response = error.response;
    const isAuthStatus = !request.ignoreAuth && AUTH_STATE_LIST.includes(response.errcode);
    if (isAuthStatus) {
      const status = await getAuthorization('local');
      if (status !== response.errcode) {
        await getAuthorization('reload');
      }
      const { route } = router.resolve(store.state.common.route.to.fullPath);
      const redirect = await checkAuthorizeRedirect(route);
      if (redirect) {
        router.push(redirect);
        return Promise.resolve();
      }
    }
    const errcode = response.errcode;
    const silent = request.ignoreError
      || (request.ignoreAuth && AUTH_STATE_LIST.includes(errcode))
      || (request.errcodeExpected && request.errcodeExpected.includes(errcode));
    if (!silent) {
      if (errcode >= 500) {
        const errmsg: string = response && response.errmsg
          ? response.errmsg
          : error.stack || '';
        showDialog({ title: `服务器错误 ${errcode}`, content: errmsg || '未知错误' });
      } else if (errcode >= 400) {
        if (isDevelop()) {
          showDialog({ title: `请求失败 ${errcode}`, content: response.errmsg || 'No errmsg.' });
        } else {
          showToast({ text: response.errmsg || '未知错误', time: 2000, type: 'warn', position: 'center' });
        }
      } else {
        showDialog({ title: `异常 ${errcode}`, content: '返回数据未知错误' });
      }
    }
    return Promise.reject(error);
  },
};

/**
 * @var {Http} 接口封装类
 */
export default new Http({
  baseUrl: BASE_API_URL,
  interceptors,
  multiRequestURL: MULTI_REQUEST_URL,
  tardyRequestTime: SLOW_API_TIME,
  maxRetry: MAX_API_RETRY_COUNT,
  requestDriver,
});
