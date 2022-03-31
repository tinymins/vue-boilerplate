/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import querystringify from 'querystringify';

import * as IS from '@/utils/is';

/**
 * Http 请求类型
 */
export type HttpMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Http 请求数据
 */
export type HttpData = Record<string, unknown> | unknown[] | string | ArrayBuffer | FormData;

/**
 * Http 请求头信息
 */
export type HttpHeaders = Record<string, string>;

/**
 * Http 请求配置
 */
export interface HttpRequestOptions<T = unknown> {
  /**
   * 数据类型
   */
  dataType?: string;
  /**
   * 返回数据类型校验
   */
  responseLint?: IS.Decoder<unknown, T>;
  /**
   * 请求方式
   */
  contentType?: 'json' | 'form';
  /**
   * 请求编码
   */
  charset?: string;
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
   * @var {HttpInterceptors} interceptors 拦截器
   */
  interceptors?: HttpInterceptors<T>;
  /**
   * 使用微信 WXP.uploadFile 请求 (注：小程序用)
   */
  useUploadFile?: boolean;
}

/**
 * Http 构造函数参数
 */
export interface HttpOptionsOptional<T = unknown> {
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
   * <pre>网络请求底层支持驱动</pre>
   * <pre>接管请求对象使用本地方法处理请求并返回结果</pre>
   * <pre>注意：只要成功接收到服务器返回，无论返回码是多少都应该进入success回调。</pre>
   *
   * @param {HttpRequestConfig<T>} request 请求对象
   * @returns {HttpPromise} 请求异步等待
   *
   * @memberOf HttpOptions
   */
  requestDriver: <TT = T>(request: HttpRequestConfig<TT>) => HttpPromise<TT>;
}

export type HttpOptions = {
  [TKey in keyof HttpOptionsOptional]-?: HttpOptionsOptional[TKey];
}

/**
 * 请求事件拦截器
 */
export interface HttpInterceptors<T = unknown> {
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
  onRequestError?: (error: HttpError<T>) => Promise<never>;
  /**
   * 请求成功
   */
  onRequestSuccess?: (error: HttpRequestConfig<T>) => void;
  /**
   * 请求结果成功返回
   * <pre>例如服务端将 HTTP 状态码包入返回数据中并始终返回 200，可以使用该拦截器过滤不合法的服务端数据。</pre>
   * <pre>通过拦截器返回 Promise.reject(new HttpError(request, response))，即可阻断业务回调并进入 HTTP 失败流程。</pre>
   */
  onResponse?: (response: HttpResponseData<T>, request: HttpRequestConfig<T>) => HttpPromise<T>;
  /**
   * 请求结果错误
   */
  onResponseError?: (error: HttpError<T>) => Promise<void>;
}

/**
 * Http 请求对象
 */
export interface HttpRequestConfig<T = unknown> {
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
  headers: HttpHeaders;
  /**
   * 请求事件拦截器
   */
  interceptors: HttpInterceptors<T>[];
  /**
   * 数据类型
   */
  dataType: string;
  /**
   * 返回数据类型约束
   */
  responseLint?: IS.Decoder<unknown, T>;
  /**
   * 请求方式
   */
  contentType: 'json' | 'form';
  /**
   * 请求编码
   */
  charset: string;
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
export interface HttpResponseData<T = unknown> {
  /**
   * 状态码
   */
  status: number;
  /**
   * 状态信息
   */
  statusText: string;
  /**
   * 数据主体
   */
  data: T;
}

export type HttpPromise<T = unknown> = Promise<HttpResponseData<T>>;
export type HttpPromiseResolve<T = unknown> = (response: T) => void;

/**
 * 多请求合并缓存信息
 */
export interface HttpMultiRequestInfo<T = unknown> {
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
export class HttpError<T = unknown> extends Error {
  /**
   * 原始错误
   */
  public error?: Error;
  /**
   * 请求对象
   */
  public request?: HttpRequestConfig<T>;
  /**
   * 返回对象
   */
  public response?: HttpResponseData<T>;

  public constructor(request: HttpRequestConfig<T>, response?: HttpResponseData<T>, error?: Error) {
    const messages = ['HTTP EXCEPTION'];
    messages.push(
      `url: ${request.url}`,
      `method: ${request.method}`,
      `data: ${request.data}`,
    );
    if (typeof request.data === 'string') {
      messages.push(`data-decoded: ${decodeURIComponent(request.data)}`);
    }
    if (response) {
      messages.push(
        `status: ${response.status}`,
        `message: ${response.statusText.replaceAll('\n', '\n           ')}`,
        `response: ${JSON.stringify(response.data)}`,
      );
    }
    super(messages.join('\n  '));
    this.name = 'HttpError';
    this.error = error;
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
   * 合并请求队列
   */
  private multiRequestQueue: HttpMultiRequestInfo[] = [];

  /**
   * 合并请求延迟计时器
   */
  private multiRequestTimer: number | null = null;

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
   * @param {HttpHeaders} headers 请求头
   * @returns {HttpRequestConfig} 请求对象
   */
  private newRequestConfig<T = unknown>(
    method: HttpMethod,
    url: string,
    data: HttpData,
    {
      dataType = 'json',
      contentType = 'json',
      charset = 'UTF-8',
      responseLint,
      modal = false,
      silent = false,
      showLoading = false,
      needReferral = false,
      ignoreAuth = false,
      ignoreError = false,
      errcodeExpected = [],
      useMultiRequest = true,
      maxRetry = this.$options.maxRetry || 0,
      interceptors = {},
      useUploadFile = false,
    }: HttpRequestOptions<T>,
    headers: HttpHeaders,
  ): HttpRequestConfig<T> {
    this.requestCount += 1;
    const request: HttpRequestConfig<T> = {
      id: Symbol(`http-request-${this.requestCount}`),
      method,
      url,
      data,
      dataType,
      contentType,
      responseLint,
      charset,
      headers,
      modal,
      showLoading: modal || (showLoading && !silent),
      needReferral,
      ignoreAuth,
      ignoreError: ignoreError || silent,
      errcodeExpected,
      useMultiRequest,
      maxRetry,
      retryCount: 0,
      useUploadFile,
      interceptors: [Object.assign({}, this.$options.interceptors as HttpInterceptors<T>), Object.assign({}, interceptors)],
    };
    if (contentType === 'form') {
      headers['Content-Type'] = `application/x-www-form-urlencoded; charset=${charset}`;
    }
    if (!(data instanceof FormData) && typeof data !== 'string') {
      let keys: string[] | null = null;
      try {
        keys = Object.keys(data);
      } catch {}
      if (keys) {
        request.data = {};
        if (contentType === 'form') {
          request.data = querystringify.stringify(data);
        } else if (contentType === 'json') {
          for (const key of Object.keys(data)) {
            if (data[key] !== void 0 && data[key] !== null) {
              request.data[key] = data[key];
            }
          }
        }
      }
    }
    return request;
  }

  /**
   * 处理 Request 请求
   * @param {HttpRequestConfig} request 请求对象
   * @returns {HttpPromise} Promise
   */
  private async processRequest<T = unknown>(request: HttpRequestConfig<T>): HttpPromise<T> {
    let tardyTimer: number | null = null;
    let networkPending = false;
    let res: HttpResponseData<T> | undefined;
    // 补全基础地址
    if (this.$options.baseUrl && !request.url.includes('://') && request.url.indexOf(this.$options.baseUrl) !== 0) {
      request.url = `${this.$options.baseUrl.replace(/\/+$/u, '')}/${request.url.replace(/^\/+/u, '')}`;
    }
    try {
      // 处理请求准备拦截器
      if (request.retryCount === 0) {
        let promise = Promise.resolve(request);
        for (let i = 0; i < request.interceptors.length; i += 1) {
          const onRequest = request.interceptors[i].onRequest;
          if (typeof onRequest === 'function') {
            promise = promise.then(onRequest);
          }
        }
        request = await promise;
      }
      // 开始慢请求计时器
      if (this.$options.tardyRequestTime > 0) {
        tardyTimer = window.setTimeout(() => {
          for (const interceptors of request.interceptors) {
            if (interceptors.onRequestTardy) {
              interceptors.onRequestTardy(request);
            }
          }
        }, this.$options.tardyRequestTime);
      }
      // 请求数据
      networkPending = true;
      res = await this.$options.requestDriver(request);
      networkPending = false;
      // 清除慢请求计时器
      if (tardyTimer) {
        clearTimeout(tardyTimer);
      }
      // 处理请求成功拦截器
      for (let i = 0; i < request.interceptors.length; i += 1) {
        const onRequestSuccess = request.interceptors[i].onRequestSuccess;
        if (typeof onRequestSuccess === 'function') {
          onRequestSuccess(request);
        }
      }
      // 进入请求成功逻辑
      return await this.processResponse<T>(res, request);
    } catch (error) {
      if (tardyTimer) {
        clearTimeout(tardyTimer);
      }
      // 判断是否是网络错误
      if (networkPending) {
        // 判断是否需要发起重连
        if (request.maxRetry > request.retryCount) {
          // 数据标记修改
          request.retryCount += 1;
          networkPending = false;
          // 处理请求重试拦截器
          for (let i = 0; i < request.interceptors.length; i += 1) {
            const onRequestRetry = request.interceptors[i].onRequestRetry;
            if (typeof onRequestRetry === 'function') {
              onRequestRetry(request);
            }
          }
          // 重试请求
          return this.processRequest(request);
        }
        // 重试全部失败，处理网络错误请求失败拦截器
        let promise = Promise.reject(error);
        for (let i = 0; i < request.interceptors.length; i += 1) {
          const onRequestError = request.interceptors[i].onRequestError;
          if (typeof onRequestError === 'function') {
            promise = promise.catch(onRequestError);
          }
        }
        await promise;
      }
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(request, res, error);
      }
      throw new HttpError(request, res, new Error(JSON.stringify(error)));
    }
  }

  /**
   * 发起一个请求
   * @param {String} method OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   * @param {String} url 请求地址
   * @param {HttpData} data 数据
   * @param {Object} options 请求设置项
   * @param {Object} headers 请求头
   * @return {Promise} 请求 Promise 等待异步结果
   */
  public request<T = unknown>(
    method: HttpMethod,
    url: string,
    data: HttpData,
    options: HttpRequestOptions<T> = {},
    headers = {},
  ): HttpPromise<T> {
    const request: HttpRequestConfig<T> = this.newRequestConfig<T>(method, url, data, options, headers);
    return this.processRequest<T>(request);
  }

  /**
   * 处理 Response 返回结果
   * @param {HttpResponseData} response 请求结果对象
   * @param {HttpRequestConfig} request 请求对象
   * @param {Promise} resolve 处理成功回调函数
   * @param {Promise} reject 处理异常回调函数
   * @return {Promise} Promise
   */
  private async processResponse<T>(response: HttpResponseData<T>, request: HttpRequestConfig<T>): HttpPromise<T> {
    try {
      if (
        response.status === 0
        || (response.status >= 200 && response.status < 300)
        || (response.status === 401 && request.ignoreAuth)
      ) {
        let promise = Promise.resolve(response);
        // 处理注册的拦截器
        for (let i = 0; i < request.interceptors.length; i += 1) {
          const onResponse = request.interceptors[i].onResponse;
          if (typeof onResponse === 'function') {
            promise = promise.then(r => onResponse(r, request));
          }
        }
        // 检查返回数据类型
        const responseLint = request.responseLint;
        if (responseLint) {
          promise = promise.then(() => new Promise((resolve, reject) => {
            const result = responseLint.decode(response.data);
            pipe(
              result,
              fold(
                (errors) => {
                  const messages = IS.PrettyReporter.report(result);
                  const splitter = messages.some(message => message.includes('\n')) ? '\n\n' : '\n';
                  response.status = 555; // 555 后端又不按文档输出数据
                  response.statusText = messages
                    .map((message, index) => {
                      const re = (/^Expecting one of:\n(?<expect>.+?)\nat (?<path>.+?) but instead got: (?<data>.+?)$/guis).exec(message)
                        || (/^Expecting (?<expect>.+?)at (?<path>.+?) but instead got: (?<data>.+?)$/guis).exec(message);
                      if (re) {
                        const path = re.groups?.path.startsWith('1.')
                          ? `response.${re.groups?.path.slice(2)}`
                          : re.groups?.path || '';
                        const expect = re.groups?.expect
                          .split('\n')
                          .map(s => s.trim())
                          .filter(_ => _)
                          .map((s) => {
                            if ((/^\w+$/uig).test(s) || (/^\w+<.+>$/uig).test(s) || (/^\(.+\)$/uig).test(s)) {
                              return s;
                            }
                            return `(${s})`;
                          })
                          .join(' | ');
                        message = `\`${path}\`: Expecting type: \`${expect}\`, but instead got data: \`${re.groups?.data}\``;
                      }
                      return `${index + 1}. ${message}`;
                    })
                    .join(splitter);
                  reject(errors);
                },
                () => resolve(response),
              ),
            );
          }));
        }
        response = await promise;
      } else {
        throw new HttpError(request, response);
      }
    } catch (error) {
      let promise = Promise.reject<void>(error);
      for (let i = 0; i < request.interceptors.length; i += 1) {
        const onResponseError = request.interceptors[i].onResponseError;
        if (typeof onResponseError === 'function') {
          promise = promise.catch(onResponseError);
        }
      }
      await promise;
    }
    return response;
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
      for (const [index, res] of response.data.entries()) {
        const queue = queues[index];
        this.processResponse(res, queue.config).then(queue.resolve).catch(queue.reject);
      }
    }
  }

  /**
   * 多请求合并代理
   * @param {HttpMethod} method 请求类型
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  private multiRequest<T>(
    method: HttpMethod,
    url: string,
    data: HttpData = {},
    options: HttpRequestOptions<T> = {},
    headers: HttpHeaders = {},
  ): HttpPromise<T> {
    if (this.$options.baseUrl && url.indexOf(this.$options.baseUrl) === 0) {
      url = url.slice(this.$options.baseUrl.length);
    }
    if (options.useMultiRequest === false || !this.$options.multiRequestURL || data instanceof FormData || url.includes('://')) {
      return this.request<T>(method, url, data, options, headers);
    }
    return new Promise((resolve: (arg0: HttpResponseData<unknown>) => void, reject) => {
      if (this.multiRequestTimer) {
        clearTimeout(this.multiRequestTimer);
      }
      const config = this.newRequestConfig<T>(method, url, data, options, headers);
      this.multiRequestQueue.push({
        config: config as HttpRequestConfig<unknown>,
        resolve,
        reject,
      });
      this.multiRequestTimer = window.setTimeout(() => this.runMultiRequest(), 5);
    }) as HttpPromise<T>;
  }

  /**
   * 发起一个 get 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public get<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('GET', url, data, options, headers);
  }

  /**
   * 发起一个 post 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public post<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('POST', url, data, options, headers);
  }

  /**
   * 发起一个 put 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public put<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('PUT', url, data, options, headers);
  }

  /**
   * 发起一个 delete 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public delete<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('DELETE', url, data, options, headers);
  }

  /**
   * 发起一个 head 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public head<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('HEAD', url, data, options, headers);
  }

  /**
   * 发起一个 options 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public options<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('OPTIONS', url, data, options, headers);
  }

  /**
   * 发起一个 patch 请求
   * @param {string} url 请求地址
   * @param {HttpData} data 请求数据
   * @param {HttpRequestConfig} options 请求设置
   * @param {HttpHeaders} headers 请求头
   * @return {Promise} 请求 Promise
   */
  public patch<T = unknown>(url: string, data?: HttpData, options?: HttpRequestOptions<T>, headers?: HttpHeaders): HttpPromise<T> {
    return this.multiRequest<T>('PATCH', url, data, options, headers);
  }
}

export default Http;
