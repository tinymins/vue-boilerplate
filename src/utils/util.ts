/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["off"] */
/* eslint no-new: 0 */

import VueRouter from 'vue-router';

export const setWechatTitle = (title: string): void => {
  document.title = title;
  // 在微信iOS webview更新到WKWebView之前我们可以通过加载一个iframe来实现单页面应用title更改。但是17年初更新到WKWebView后该方法也失效，
  // 据对开发者十分特别不友好的把所有文档放在同一个页面不能通过url区分甚至连锚点也懒得做的的微信开发文档说，3月份会修复。
  // const mobile = navigator.userAgent.toLowerCase();
  // if (/iphone|ipad|ipod/.test(mobile)) {
  //   const iframe = document.createElement('iframe');
  //   iframe.style.visibility = 'hidden';
  //   iframe.setAttribute('src', '/favicon.ico');
  //   const iframeCallback = () => {
  //     setTimeout(() => {
  //       iframe.removeEventListener('load', iframeCallback);
  //       document.body.removeChild(iframe);
  //     }, 0);
  //   };
  //   iframe.addEventListener('load', iframeCallback);
  //   document.body.appendChild(iframe);
  // }
};

/**
 * 递归克隆变量
 * @param {object} obj 要复制的变量
 * @param {Map} cache 递归时的缓存 标记是否出现循环递归
 * @returns {object} 克隆得到的新变量
 */
function cloneR<T = any>(obj: T, cache = new Map()): T {
  // check if obj has already cloned before (circular)
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  // new clone
  let newObj: Record<any, any> = obj;
  const type = typeof obj;
  if (type === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      newObj = [];
      cache.set(obj, newObj);
      obj.forEach((v, i) => {
        newObj[i] = cloneR(v, cache);
      });
    } else {
      newObj = {};
      cache.set(obj, newObj);
      Object.keys(obj).forEach((k) => {
        newObj[k] = cloneR(obj[k], cache);
      });
    }
  }
  return newObj;
}

/**
 * 递归克隆变量
 * @param {object} obj 要复制的变量
 * @returns {object} 克隆得到的新变量
 */
export const clone = <T = any>(obj: T): T => cloneR(obj);

// export const clone = obj => JSON.parse(JSON.stringify(obj));

/**
 * 解码 JSON 数据
 * @param {string} str 编码的 JSON 串
 * @returns {object | undefined} 解码成功的数据 或解码失败返回 undefined
 */
export function decodeJson<T = any>(str: string): T | undefined {
  try {
    return JSON.parse(str);
  } catch (e) {
    return void 0;
  }
}

export const encodeJson = <T = any>(obj: T): string => JSON.stringify(obj);

export const compareVersion = (v1: string, v2: string): 1 | -1 | 0 => {
  const a1 = v1.split('.');
  const a2 = v2.split('.');
  const length = Math.max(a1.length, a2.length);
  for (let i = 0; i < length; i += 1) {
    const p1 = parseInt(a1[i] || '0', 10) || 0;
    const p2 = parseInt(a2[i] || '0', 10) || 0;
    if (p1 !== p2) {
      return p1 > p2 ? 1 : -1;
    }
    if (i === length - 1) return 0;
  }
  return 0;
};

/**
 * 深度对比两个变量一致性
 * @param {object} p1 变量1
 * @param {object} p2 变量2
 * @param {object} options 定制参数 支持配置过滤kv值 是否是强匹配
 * @returns {boolean} 是否一致
 */
export function equals<T1 = any, T2 = any>(p1: T1, p2: T2, {
  ignoreKeys = [],
  ignoreValues = [],
  judgeKeys = [],
  strictType = true,
}: {
  ignoreKeys?: any[];
  ignoreValues?: any[];
  judgeKeys?: any[];
  strictType?: boolean;
} = {}): boolean {
  const v1 = !strictType && typeof p1 === 'number' ? p1.toString() : p1;
  const v2 = !strictType && typeof p2 === 'number' ? p2.toString() : p2;
  if (v1 === v2) {
    return true;
  }
  if (typeof v1 !== typeof v2) {
    return false;
  }
  if (
    (v1 instanceof Array && p2 instanceof Array)
    || (v1 && v2
      && typeof v1 === 'object' && typeof v2 === 'object'
      && !(v1 instanceof Array) && !(v2 instanceof Array))
  ) {
    let k1 = Object.keys(v1);
    let k2 = Object.keys(v2);
    if (judgeKeys.length) {
      k1 = k1.filter(k => judgeKeys.includes(k));
      k2 = k2.filter(k => judgeKeys.includes(k));
    }
    if (ignoreKeys.length) {
      k1 = k1.filter(k => !ignoreKeys.includes(k));
      k2 = k2.filter(k => !ignoreKeys.includes(k));
    }
    if (ignoreValues.length) {
      k1 = k1.filter(k => !ignoreValues.includes(v1[k]));
      k2 = k2.filter(k => !ignoreValues.includes(v2[k]));
    }
    if (k1.length !== k2.length) {
      return false;
    }
    let eq = true;
    k1.forEach((k) => {
      if (eq && !equals(v1[k], v2[k], { ignoreValues, ignoreKeys, strictType })) {
        eq = false;
      }
    });
    return eq;
  }
  return false;
}

export const go = (url: any, $router: VueRouter): void => {
  if ((/^javas/u).test(url) || !url) return;
  const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !(/http/u).test(url));
  if (useRouter) {
    if (typeof url === 'object' && url.replace === true) {
      $router.replace(url);
    } else if (url === 'BACK') {
      $router.go(-1);
    } else {
      $router.push(url);
    }
  } else {
    window.location.href = url;
  }
};

export const concatPath = (...paths): string =>
  paths.map((path, i) => {
    if (i === 0) {
      return path.replace(/([^/])\/+$/gu, '$1');
    }
    if (i === paths.length - 1) {
      return path.replace(/^\/+([^/])/gu, '$1');
    }
    return path.replace(/(?:^\/+|\/+$)/gu, '');
  }).filter(_ => _).join('/').replace(/(?:^\/\/|\/\/$)/gu, '/');

/**
 * 更新一个对象
 * @param {object} o 要更新的对象
 * @param {object} options 更新的参数 支持覆盖和数值加减
 * @returns {object} 原对象
 */
export function updateObject<T = any>(o: T, { assign, offset }: { assign?: Record<any, any>; offset?: Record<any, number> }): T {
  if (offset) {
    Object.keys(offset).forEach((k) => {
      o[k] = (o[k] || 0) + offset[k];
    });
  }
  if (assign) {
    Object.assign(o, assign);
  }
  return o;
}

export const getElementPath = (element: HTMLElement | null): HTMLElement[] => {
  const path: HTMLElement[] = [];
  while (element) {
    path.push(element);
    element = element.parentElement;
  }
  return path;
};

interface PromiseInfo<T> {
  id: string;
  promise: Promise<T>;
}

/**
 * 通过唯一标示 合并多个 Promise 为单个处理
 * @param {Function} promiseGenerator 获取 Promise 的函数
 * @param {Function} idGenerator 获取唯一标示的函数
 * @returns {Promise} Promise
 */
export function singletonPromise<T = any>(promiseGenerator: Function, idGenerator: Function): () => Promise<T> {
  const promises: PromiseInfo<T>[] = [];
  return (...args) => {
    const id = idGenerator(...args);
    let promiseInfo = id && promises.find(p => equals(p.id, id));
    if (!promiseInfo) {
      promiseInfo = {
        id,
        promise: new Promise((resolve, reject) =>
          promiseGenerator(...args).then((res) => {
            resolve(res);
          }).catch(reject).then(() => {
            const index = promises.findIndex(p => equals(p.id, id));
            if (index >= 0) {
              promises.splice(index, 1);
            }
          })),
      };
      promises.push(promiseInfo);
    }
    return promiseInfo.promise;
  };
}

// TODO: complete format param
export const formatDuration = (duration: number/* , format = 'MM:ss' */): string => {
  const hour = Math.floor(duration / 3600);
  const minute = Math.floor((duration / 60) % 60);
  const minuteString = minute >= 10 ? minute.toString(10) : `0${minute}`;
  const second = Math.floor(duration % 60);
  const secondString = second >= 10 ? second.toString(10) : `0${second}`;
  return hour > 0 ? `${hour}:${minuteString}:${secondString}` : `${minuteString}:${secondString}`;
};

/**
 * 创建对象代理访问
 * @param {object} proxy 代理对象
 * @param {object} object 实际数据对象
 * @param {object} options 触发器和键值设置项
 * @returns {object} proxy 代理对象
 */
export function createObjectProxy<T = any>(proxy, object: T, {
  setter,
  onset,
  getter,
  keys = Object.keys(object),
}: {
  setter?: (object: T, k: any, v: any) => void;
  onset?: (object: T, k: any, v: any) => void;
  getter?: (object: T, k: any) => void;
  keys?: Record<any, any>;
} = {}): T {
  keys.forEach((k) => {
    Object.defineProperty(
      proxy,
      k,
      {
        configurable: true,
        set: (val) => {
          if (setter) {
            setter(object, k, val);
          } else {
            object[k] = val;
          }
          if (onset) onset(object, k, val);
        },
        get: () => (getter ? getter(object, k) : object[k]),
      },
    );
  });
  return proxy;
}

export const sleep = (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), time);
});

export const safeCall = (func: Function, ...args): void => {
  try {
    func(...args);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
};

export const randomChild = <T = any>(list: T[]): T => list[Math.floor(Math.random() * list.length) % list.length];
