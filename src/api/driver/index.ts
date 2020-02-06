/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Axios, { AxiosRequestConfig } from 'axios';
import { BASE_API_URL, SLOW_API_TIME, MAX_API_RETRY_COUNT, MULTI_REQUEST_URL, CAMELIZE_API_RESPONSE, AUTH_STATE_LIST } from '@/config';
import { isInDevMode } from '@/utils/environment';
import { camelize } from '@/utils/transfer';
import { parseNavLocation, navigateLocation } from '@/utils/navigation';
import { checkAuthorizeRedirect, getAuthorization } from '@/utils/authorization';
import { StoreInstance } from '@/store';
import { showDialog, showLoading, hideLoading, showToast, hideToast } from '@/store/utils';
import { RouterInstance } from '@/router';
import Http, { HttpError, HttpRequestConfig, HttpPromise, HttpResponseData, HttpInterceptors } from './http';

export type HttpInstance = Http;

/**
 * 创建 http 实例
 * @param {Store} store Store对象
 * @param {Router} router Router对象
 * @param {object} headers 要注入的请求头
 * @return {Http} http实例对象
 */
const createHttp = (
  store: StoreInstance,
  router: RouterInstance,
): Http => {
  const config: AxiosRequestConfig = {
    baseURL: '',
    withCredentials: true,
    timeout: 30000,
  };
  const axios = Axios.create(config);

  /**
   * 接管请求对象使用本地方法处理请求并返回结果
   * 注意：只要成功接收到服务器返回，无论返回码是多少都应该进入success回调。
   * @param {HttpRequestConfig} request 请求对象
   * @returns {HttpPromise} 请求异步等待
   */
  function requestDriver<T = unknown>(request: HttpRequestConfig): HttpPromise<T> {
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
      headers: request.headers,
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
  }

  /**
   * @var {object} interceptors
   */
  const interceptors: HttpInterceptors = {
    onRequest(request) {
      // 追加 token
      const token = '';
      // const token = authorization.token;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
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
        showLoading(store, { id: request.id, text: '数据加载中' });
      }
      return Promise.resolve(request);
    },
    onRequestTardy(request) {
      hideLoading(store, { id: request.id });
      if (request.showLoading) {
        showLoading(store, { id: request.id, text: '数据加载中' });
      }
    },
    onRequestRetry() {
      hideToast(store, { id: 'http-error' });
      showToast(store, {
        id: 'http-error',
        text: '网络错误，正在尝试重新连接…',
        time: 2000,
        type: 'error',
      });
    },
    onRequestError(error: HttpError) {
      if (!store.state.common.bus.redirected) {
        showToast(store, {
          id: 'http-error',
          text: '网络连接失败…',
          time: 2000,
          type: 'error',
        });
      }
      hideLoading(store, { id: error.request.id });
      return Promise.reject(error);
    },
    onRequestSuccess(request) {
      hideToast(store, { id: 'http-error' });
      hideLoading(store, { id: request.id });
    },
    onResponse(res) {
      if (res.data && CAMELIZE_API_RESPONSE) {
        camelize(res.data, { modify: true });
      }
      const dialog = res.dialog;
      if (dialog) {
        showDialog(store, {
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
        showToast(store, {
          text: toast.message,
          time: toast.time || 2000,
          type: toast.type || 'warning',
        });
      }
      return Promise.resolve(res);
    },
    async onResponseError(error) {
      const request = error.request;
      const response = error.response;
      const isAuthStatus = !request.ignoreAuth && AUTH_STATE_LIST.includes(response.errcode);
      if (isAuthStatus) {
        const status = await getAuthorization(store, 'local');
        if (status !== response.errcode) {
          await getAuthorization(store, 'reload');
        }
        if (store.state.common.route.to && store.state.common.route.to.fullPath) {
          const { route } = router.resolve(store.state.common.route.to.fullPath);
          const redirect = await checkAuthorizeRedirect(store, route);
          if (redirect) {
            router.push(redirect);
            return Promise.resolve();
          }
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
          showDialog(store, { title: `服务器错误 ${errcode}`, content: errmsg || '未知错误' });
        } else if (errcode >= 400) {
          if (isInDevMode('manually')) {
            showDialog(store, { title: `请求失败 ${errcode}`, content: response.errmsg || 'No errmsg.' });
          } else {
            showToast(store, { text: response.errmsg || '未知错误', time: 2000, type: 'warning', position: 'center' });
          }
        } else {
          showDialog(store, { title: `异常 ${errcode}`, content: '返回数据未知错误' });
        }
      }
      return Promise.reject(error);
    },
  };

  /**
   * @var {Http} 接口封装类
   */
  return new Http({
    baseUrl: BASE_API_URL,
    interceptors,
    multiRequestURL: MULTI_REQUEST_URL,
    tardyRequestTime: SLOW_API_TIME,
    maxRetry: MAX_API_RETRY_COUNT,
    requestDriver,
  });
};

export default createHttp;
