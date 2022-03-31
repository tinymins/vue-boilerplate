/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import querystringify from 'querystringify';
import { BASE_API_URL, SLOW_API_TIME, MAX_API_RETRY_COUNT, MULTI_REQUEST_URL, AUTH_STATE_LIST } from '@/config';
import { isInDevMode } from '@/utils/environment';
import { checkAuthorizeRedirect, getAuthorization } from '@/utils/authorization';
import { StoreInstance } from '@/store';
import { showDialog, showLoading, hideLoading, showToast, hideToast } from '@/store/utils';
import { RouterInstance } from '@/router';
import Http, { HttpError, HttpInterceptors, HttpOptionsOptional, HttpPromise, HttpRequestConfig, HttpResponseData } from './http';

export * from './http';
export type ApiInstance = Http;

/**
 * 创建 HTTP 实例对象的参数
 */
interface CreateApiParams<TServiceBasicResponse> {
  /**
   * Store对象
   */
  store: StoreInstance;
  /**
   * Router对象
   */
  router: RouterInstance;
  /**
   * 覆盖初始化 HTTP 类的构造数据
   */
  options?: Partial<HttpOptionsOptional<TServiceBasicResponse>>;
  /**
   * headers 要注入的请求头
   */
  headers?: Record<string, string>;
  /**
   * 原始请求修改器
   */
  rawResponseMapper?: <T extends TServiceBasicResponse = TServiceBasicResponse>(res: HttpResponseData<T>) => HttpResponseData<T>;
}

/**
 * 创建 HTTP 实例
 * @param {CreateApiParams} params 自定义参数
 * @return {Http} HTTP 实例对象
 */
const createApi = <TServiceBasicResponse>(params: CreateApiParams<TServiceBasicResponse>): Http => {
  const config: AxiosRequestConfig = {
    baseURL: '',
    withCredentials: true,
    timeout: 30000,
  };
  const store = params.store;
  const router = params.router;
  if (params.headers) {
    config.headers = params.headers;
  }
  const axios = Axios.create(config);

  /**
   * 接管请求对象使用本地方法处理请求并返回结果
   * 注意：只要成功接收到服务器返回，无论返回码是多少都应该进入success回调。
   * @param {HttpRequestConfig} request 请求对象
   * @returns {HttpPromise} 请求异步等待
   */
  function requestDriver<T extends TServiceBasicResponse = TServiceBasicResponse>(request: HttpRequestConfig): HttpPromise<T> {
    // // https://developers.weixin.qq.com/miniprogram/dev/api/api-network.html
    // if (config.useUploadFile) {
    //   request.name = data.name;
    //   request.filePath = data.filePath;
    //   return await WXP.uploadFile(request);
    // }
    // return await WXP.request(request);
    const stringifydata = (data: typeof request['data']) => {
      if (data instanceof FormData || data instanceof ArrayBuffer || typeof data === 'string') {
        return data;
      }
      return querystringify.stringify(data);
    };
    let url = request.url;
    const body = stringifydata(request.data);
    const fetchConfig: RequestInit = {
      method: request.method,
      headers: Object.assign({}, params.headers, request.headers),
      credentials: 'include',
    };
    if (request.method === 'PUT' || request.method === 'POST' || request.method === 'PATCH') {
      fetchConfig.body = body;
    } else if (body) {
      url = url.includes('?') ? `${url}&${body}` : `${url}?${body}`;
    }
    const axiosConfig: AxiosRequestConfig = {
      url,
      method: request.method,
      headers: request.headers,
      [request.method === 'PUT' || request.method === 'POST' || request.method === 'PATCH' ? 'data' : 'params']: request.data,
    };
    return new Promise((resolve, reject) => {
      const onResponse = (res: AxiosResponse<T>) => {
        let data = res.data;
        if (typeof res.data === 'string' && request.dataType === 'json') {
          try {
            data = JSON.parse(data as unknown as string);
          } catch {}
        }
        let response: HttpResponseData<T> = {
          status: res.status === 200 ? 0 : res.status,
          message: 'OK',
          data,
        };
        if (params.rawResponseMapper) {
          response = params.rawResponseMapper<T>(response);
        }
        resolve(response);
      };
      const onError = (error: AxiosError<T>): void => {
        if (error && error.response) {
          onResponse(error.response);
        } else {
          reject(new HttpError(request, void 0, error));
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
      // 显示加载中遮罩层
      if (request.modal) {
        showLoading(store, { id: request.id, modal: true, text: '数据加载中' });
      }
      return Promise.resolve(request);
    },
    onRequestTardy(request) {
      if (request.showLoading && !request.modal) {
        showLoading(store, { id: request.id, text: '数据加载中' });
      }
    },
    onRequestRetry(request) {
      if (request.showLoading && !request.modal) {
        hideToast(store, { id: `http-error/${request.id.toString()}` });
        showToast(store, {
          id: `http-error/${request.id.toString()}`,
          text: '网络错误，正在尝试重新连接…',
          time: 2000,
          type: 'error',
        });
      }
    },
    onRequestError(error) {
      if (error.request) {
        if (!error.request.ignoreError) {
          showToast(store, {
            id: `http-error/${error.request.id.toString()}`,
            text: '网络连接失败…',
            time: 2000,
            type: 'error',
          });
        }
        hideLoading(store, { id: error.request.id });
      }
      return Promise.reject(error);
    },
    onRequestSuccess(request) {
      hideToast(store, { id: `http-error/${request.id.toString()}` });
      hideLoading(store, { id: request.id });
    },
    onResponse(response, request) {
      if (
        response.status === 0
        || (response.status >= 200 && response.status < 300)
        || (response.status === 401 && request.ignoreAuth)
      ) {
        return Promise.resolve(response);
      }
      return Promise.reject(new HttpError(request, response));
    },
    async onResponseError(error) {
      const request = error.request;
      const response = error.response;
      if (request && response) {
        const isAuthStatus = AUTH_STATE_LIST.includes(response.status);
        if (!request.ignoreAuth && isAuthStatus) {
          const status = await getAuthorization(store, 'local');
          if (status !== response.status) {
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
        const errcode = response.status;
        const silent = request.ignoreError
          || (request.ignoreAuth && isAuthStatus)
          || (request.errcodeExpected && request.errcodeExpected.includes(errcode));
        if (!silent) {
          if (errcode >= 500) {
            const errmsg: string = response && response.message
              ? response.message
              : error.stack || '';
            showDialog(store, { title: `服务器错误 ${errcode}`, content: errmsg || '未知错误' });
          } else if (errcode >= 400) {
            if (isInDevMode('manually')) {
              showDialog(store, { title: `请求失败 ${errcode}`, content: response.message || 'No errmsg.' });
            } else {
              showToast(store, { text: response.message || '未知错误', time: 2000, type: 'warning', position: 'center' });
            }
          } else {
            showDialog(store, { title: `异常 ${errcode}`, content: '返回数据未知错误' });
          }
        }
      }
      return Promise.reject(error);
    },
  };

  /**
   * @var {Http} 接口封装类
   */
  return new Http(Object.assign(
    {
      baseUrl: BASE_API_URL,
      interceptors,
      multiRequestURL: MULTI_REQUEST_URL,
      tardyRequestTime: SLOW_API_TIME,
      maxRetry: MAX_API_RETRY_COUNT,
      requestDriver,
    },
    params.options,
  ));
};

export default createApi;
