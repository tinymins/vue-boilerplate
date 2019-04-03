/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */
/* eslint max-classes-per-file: "off" */
/* eslint no-async-promise-executor: "off" */
/* eslint @typescript-eslint/no-type-alias: "off" */
/* eslint @typescript-eslint/member-ordering: "off" */
/* eslint @typescript-eslint/no-empty-interface: "off" */

/**
 * Http 请求类型
 */
export type HttpMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH';

/**
 * Http 请求数据
 */
export type HttpData = object | string | ArrayBuffer | FormData;

/**
 * Http 请求头信息
 */
export type HttpHeader = Record<string, string>;

/**
 * Http 请求配置
 */
export interface HttpRequestOptions {
  /**
   * 数据类型
   */
  dataType?: string;
  /**
   * 模式窗口，立即显示加载中弹出框直到完成 (默认 false)
   */
  modal?: boolean;
  /**
   * 静默请求 不显示加载中并忽略所有错误 (默认 false) (语法糖，等价于 { showLoading: false, ignoreAuth: true, ignoreError: true })
   */
  silent?: boolean;
  /**
   * 请求超过指定请求时间自动显示加载中 (默认 true)
   */
  showLoading?: boolean;
  /**
   * 是否需要发送用户 referral
   */
  needReferral?: boolean;
  /**
   * 无视登录状态 (默认 false)
   */
  ignoreAuth?: boolean;
  /**
   * 无视请求错误 不弹出错误框 (默认 false)
   */
  ignoreError?: boolean;
  /**
   * 允许出现的请求错误状态码列表 在该列表中的错误不显示错误框 (默认为空 [])
   */
  errcodeExpected?: number[];
  /**
   * 允许多请求合并代理 (默认 true)
   */
  useMultiRequest?: boolean;
  /**
   * 网络连接失败时该请求最大重试次数 (默认读取全局配置)
   */
  maxRetry?: number;
  /**
   * 使用微信 WXP.uploadFile 请求 (注：小程序用)
   */
  useUploadFile?: boolean;
}

/**
 * Http 构造函数参数
 */
export interface HttpOptionsOptional<T = any> {
  /**
   * @var {string} baseUrl
   */
  baseUrl?: string;
  /**
   * @var {HttpInterceptors} interceptors 拦截器
   */
  interceptors?: HttpInterceptors<T>;
  /**
   * 多请求合并代理地址 置空则禁止合并请求
   * @var {string} multiRequestURL
   */
  multiRequestURL?: string | null;
  /**
   * 出现加载框延迟时间 -1 表示不出现加载框
   */
  tardyRequestTime?: number;
  /**
   * 网络异常最多重试次数
   */
  maxRetry?: number;
  /**
   * 网络请求底层支持驱动
   */
  requestDriver: <T = any>(request: HttpRequestConfig<T>) => HttpPromise<T>;
}

export type HttpOptions = {
  [TKey in keyof HttpOptionsOptional]-?: HttpOptionsOptional[TKey];
}

/**
 * 请求事件拦截器
 */
export interface HttpInterceptors<T = any> {
  /**
   * 请求开始
   */
  onRequest?: (request: HttpRequestConfig<T>) => Promise<HttpRequestConfig<T>>;
  /**
   * 请求缓慢
   */
  onRequestTardy?: (request: HttpRequestConfig<T>) => void;
  /**
   * 请求重试
   */
  onRequestRetry?: (request: HttpRequestConfig<T>) => void;
  /**
   * 请求错误
   */
  onRequestError?: (error: HttpError<T>) => Promise<void>;
  /**
   * 请求成功
   */
  onRequestSuccess?: (error: HttpRequestConfig<T>) => void;
  /**
   * 请求结果成功返回
   */
  onResponse?: (request: HttpResponseData<T>) => Promise<HttpResponseData<T>>;
  /**
   * 请求结果错误
   */
  onResponseError?: (error: HttpError<T>) => Promise<void>;
}

/**
 * Http 请求对象
 */
export interface HttpRequestConfig<T = any> {
  /**
   * 唯一标识符
   */
  id: symbol;
  /**
   * 请求地址
   */
  url: string;
  /**
   * 请求类型
   */
  method: HttpMethod;
  /**
   * 请求数据
   */
  data: HttpData;
  /**
   * 请求头
   */
  header: HttpHeader;
  /**
   * 请求事件拦截器
   */
  interceptors: HttpInterceptors<T>;
  /**
   * 数据类型
   */
  dataType: string;
  /**
   * 模式窗口，立即显示加载中弹出框直到完成 (默认 false)
   */
  modal: boolean;
  /**
   * 请求超过指定请求时间自动显示加载中 (默认 true)
   */
  showLoading: boolean;
  /**
   * 是否需要发送用户 referral
   */
  needReferral: boolean;
  /**
   * 无视登录状态 (默认 false)
   */
  ignoreAuth: boolean;
  /**
   * 无视请求错误 不弹出错误框 (默认 false)
   */
  ignoreError: boolean;
  /**
   * 允许出现的请求错误状态码列表 在该列表中的错误不显示错误框 (默认为空 [])
   */
  errcodeExpected: number[];
  /**
   * 允许多请求合并代理 (默认 true)
   */
  useMultiRequest: boolean;
  /**
   * 网络连接失败时该请求最大重试次数 (默认读取全局配置)
   */
  maxRetry: number;
  /**
   * 当前重试次数计数器
   */
  retryCount: number;
  /**
   * 使用微信 WXP.uploadFile 请求 (注：小程序用)
   */
  useUploadFile: boolean;
  /**
   * 微信 WXP.uploadFile 请求 name 参数 (注：小程序用)
   */
  name?: string;
  /**
   * 微信 WXP.uploadFile 请求 filePath 参数 (注：小程序用)
   */
  filePath?: string;
}

/**
 * Http 请求成功返回
 */
export interface HttpResponseData<T = any> {
  /**
   * 错误码
   */
  errcode: number;
  /**
   * 错误信息
   */
  errmsg: string;
  /**
   * 返回数据
   */
  data: T;
  /**
   * 全局对话框
   */
  dialog?: any;
  /**
   * 全局提示框
   */
  toast?: any;
}

/**
 * Http 请求成功对象 (内部使用)
 */
export interface HttpResponse<T = any> {
  /**
   * 请求对象
   */
  request: HttpRequestConfig<T>;
  /**
   * 状态码
   */
  status: number;
  /**
   * 请求返回数据
   */
  data: HttpResponseData<T>;
}

export interface HttpPromise<T = any> extends Promise<HttpResponseData<T>> {}
export type HttpPromiseResolve<T = any> = (response: T) => void;

/**
 * 多请求合并缓存信息
 */
export interface HttpMultiRequestInfo<T = any> {
  /**
   * 请求对象
   */
  config: HttpRequestConfig<T>;
  /**
   * 合并请求成功 Promise 回调
   */
  resolve: (response: HttpResponseData<T>) => void;
  /**
   * 合并请求失败 Promise 回调
   */
  reject: (error: HttpError<T>) => void;
}

/**
 * Http 请求失败异常
 */
export class HttpError<T = any> extends Error {
  /**
   * 错误码
   */
  public code?: string;
  /**
   * 请求对象
   */
  public request: HttpRequestConfig<T>;
  /**
   * 返回对象
   */
  public response: HttpResponseData<T>;

  public constructor(request: HttpRequestConfig<T>, response: HttpResponseData<T>) {
    super('http response error');
    this.request = request;
    this.response = response;
  }
}

/**
 * 网络请求 request 基类
 */
export class Http {
  /**
   * 配置参数
   */
  private $options: HttpOptions;

  /**
   * @var {number} requestCount
   */
  private requestCount = 0;

  /**
   * 缓慢请求计时器
   * @var {object} tardyTimers
   */
  private tardyTimers = new Map<symbol, number>();

  /**
   * 合并请求队列
   */
  private multiRequestQueue: HttpMultiRequestInfo[] = [];

  /**
   * 合并请求延迟计时器
   */
  private multiRequestTimer = 0;

  /**
   * 构造函数
   * @param {HttpOptionsOptional} options 请求配置项
   */
  public constructor(options: HttpOptionsOptional) {
    const defaultOptions: HttpOptions = {
      baseUrl: '',
      interceptors: {},
      multiRequestURL: '',
      tardyRequestTime: 300,
      maxRetry: 0,
      requestDriver: options.requestDriver,
    };
    this.$options = Object.assign(defaultOptions, options);
  }

  /**
   * 创建一个请求对象
   * @param {HttpMethod} method 请求类型
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpOptions} options 请求设置
   * @param {HttpHeader} header 请求头
   * @returns {HttpRequestConfig} 请求对象
   */
  private newRequestConfig<T = any>(
    method: HttpMethod,
    url: string,
    data: HttpData,
    {
      dataType = 'json',
      modal = false,
      silent = false,
      showLoading = true,
      needReferral = false,
      ignoreAuth = false,
      ignoreError = false,
      errcodeExpected = [],
      useMultiRequest = true,
      maxRetry = this.$options.maxRetry || 0,
      useUploadFile = false,
    }: HttpRequestOptions,
    header: HttpHeader,
  ): HttpRequestConfig<T> {
    this.requestCount += 1;
    const request: HttpRequestConfig = {
      id: Symbol(`http-request-${this.requestCount}`),
      method,
      url,
      data: {},
      dataType,
      header,
      modal,
      showLoading: modal || (showLoading && !silent),
      needReferral,
      ignoreAuth: ignoreAuth || silent,
      ignoreError: ignoreError || silent,
      errcodeExpected,
      useMultiRequest,
      maxRetry,
      retryCount: 0,
      useUploadFile,
      interceptors: Object.assign({}, this.$options.interceptors),
    };
    if (data instanceof FormData || !data || typeof data[Symbol.iterator] !== 'function') {
      request.data = data;
    } else {
      Object.keys(data).forEach((key) => {
        if (data[key] !== void 0 && data[key] !== null) {
          request.data[key] = data[key];
        }
      });
    }
    return request;
  }

  /**
   * 处理 Request 请求
   * @param {HttpRequestConfig} request 请求对象
   * @returns {HttpPromise} Promise
   */
  private processRequest<T = any>(request: HttpRequestConfig): HttpPromise<T> {
    let tardyTimer;
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof request.interceptors.onRequest === 'function') {
          Object.assign(request, await request.interceptors.onRequest(request));
          delete request.interceptors.onRequest;
        }
        if (this.$options.baseUrl && request.url.indexOf('://') === -1 && request.url.indexOf(this.$options.baseUrl) !== 0) {
          request.url = `${this.$options.baseUrl.replace(/\/+$/u, '')}/${request.url.replace(/^\/+/u, '')}`;
        }
        if (this.$options.tardyRequestTime > 0) {
          tardyTimer = window.setTimeout(() => {
            if (request.interceptors.onRequestTardy) {
              request.interceptors.onRequestTardy(request);
            }
          }, this.$options.tardyRequestTime);
        }
        const res = await this.$options.requestDriver(request);
        if (tardyTimer) {
          window.clearTimeout(tardyTimer);
        }
        if (request.interceptors.onRequestSuccess) {
          request.interceptors.onRequestSuccess(request);
        }
        this.processResponse<T>(res, request, resolve, reject);
      } catch (error) {
        if (tardyTimer) {
          window.clearTimeout(tardyTimer);
        }
        if (request.maxRetry > request.retryCount) {
          request.retryCount += 1;
          if (request.interceptors.onRequestRetry) {
            request.interceptors.onRequestRetry(request);
          }
          this.processRequest(request).then(resolve).catch(reject);
        } else {
          let res = error;
          if (typeof request.interceptors.onRequestError === 'function') {
            res = request.interceptors.onRequestError(res);
            delete request.interceptors.onRequestError;
          }
          reject(res);
        }
      }
    });
  }

  /**
   * 发起一个请求
   * @param {String} method OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   * @param {String} url 请求地址
   * @param {HttpData} data 数据
   * @param {Object} options 请求设置项
   * @param {Object} header 请求头
   * @return {Promise} 请求 Promise 等待异步结果
   */
  public request<T = any>(method: HttpMethod, url: string, data: HttpData, options: HttpRequestOptions = {}, header = {}): HttpPromise<T> {
    const request: HttpRequestConfig<T> = this.newRequestConfig<T>(method, url, data, options, header);
    return this.processRequest<T>(request);
  }

  /**
   * 处理 Response 返回结果
   * @param {HttpResponse} response 请求结果对象
   * @param {HttpRequestConfig} request 请求对象
   * @param {Promise} resolve 处理成功回调函数
   * @param {Promise} reject 处理异常回调函数
   * @return {Promise} Promise
   */
  private processResponse<T>(response: HttpResponseData<T>, request: HttpRequestConfig<T>, resolve, reject): void {
    if (response.errcode === 0 || (response.errcode >= 200 && response.errcode < 300)) {
      let promise = Promise.resolve(response);
      if (typeof request.interceptors.onResponse === 'function') {
        promise = promise.then(request.interceptors.onResponse);
      }
      promise.then(resolve).catch(reject);
    } else {
      const error = new HttpError(request, response);
      let promise = Promise.reject<void>(error);
      if (typeof request.interceptors.onResponseError === 'function') {
        promise = promise.catch(request.interceptors.onResponseError);
      }
      promise.catch(reject);
    }
  }

  /**
   * 执行多请求合并代理队列
   * @return {void}
   */
  private async runMultiRequest(): Promise<void> {
    if (!this.$options.multiRequestURL) {
      throw new Error('Multi-request feature disabled due to empty multiRequestURL.');
    }
    const queues = this.multiRequestQueue.splice(0);
    if (queues.length === 1) { // 只有一个的情况下 直接发送
      const queue = queues[0];
      this.processRequest(queue.config).then(queue.resolve).catch(queue.reject);
    } else if (queues.length > 1) {
      const needReferral = queues.some(p => p.config.needReferral === true);
      const ignoreAuth = !queues.some(p => !p.config.ignoreAuth);
      const ignoreError = !queues.some(p => !p.config.ignoreError);
      const showLoading = queues.some(p => !!p.config.showLoading);
      const response = await this.request<HttpResponseData[]>('POST', this.$options.multiRequestURL, queues.map(p => ({
        method: p.config.method,
        uri: p.config.url,
        data: p.config.data,
      })), { ignoreAuth, ignoreError, showLoading, needReferral }, { 'Multi-Requests': `Simultaneously, ${queues.length} requests` });
      response.data.forEach((res, index) => {
        const queue = queues[index];
        this.processResponse(res, queue.config, queue.resolve, queue.reject);
      });
    }
  }

  /**
   * 多请求合并代理
   * @param {HttpMethod} method 请求类型
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  private multiRequest<T>(
    method: HttpMethod,
    url: string,
    data: HttpData = {},
    options: HttpRequestOptions = {},
    header: HttpHeader = {},
  ): HttpPromise<T> {
    if (options.useMultiRequest === false || !this.$options.multiRequestURL) {
      return this.request<T>(method, url, data, options, header);
    }
    return new Promise((resolve: (T) => void, reject) => {
      if (this.multiRequestTimer) {
        clearTimeout(this.multiRequestTimer);
      }
      const config = this.newRequestConfig<T>(method, url, data, options, header);
      this.multiRequestQueue.push({ config, resolve, reject });
      this.multiRequestTimer = window.setTimeout(() => this.runMultiRequest(), 5);
    });
  }

  /**
   * 发起一个 get 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public get<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('GET', url, data, options, header);
  }

  /**
   * 发起一个 post 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public post<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('POST', url, data, options, header);
  }

  /**
   * 发起一个 put 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public put<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('PUT', url, data, options, header);
  }

  /**
   * 发起一个 delete 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public delete<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('DELETE', url, data, options, header);
  }

  /**
   * 发起一个 head 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public head<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('HEAD', url, data, options, header);
  }

  /**
   * 发起一个 options 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public options<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('OPTIONS', url, data, options, header);
  }

  /**
   * 发起一个 patch 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeader} header 请求头
   * @return {Promise} 请求 Promise
   */
  public patch<T = any>(url: string, data?: HttpData, options?: HttpRequestOptions, header?: HttpHeader): HttpPromise<T> {
    return this.multiRequest<T>('PATCH', url, data, options, header);
  }
}

export default Http;
