/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { PropKey } from '@/types';
import { PickerGroupData } from '@/views/common/static/components/picker-handler/types';

type BasicCloneableType = object | number | string | boolean;
type CloneableType = BasicCloneableType | BasicCloneableType[];

/**
 * 递归克隆变量
 * @param {object} obj 要复制的变量
 * @param {Map} cache 递归时的缓存 标记是否出现循环递归
 * @returns {object} 克隆得到的新变量
 */
function cloneR<T extends CloneableType = CloneableType>(obj: T, cache = new Map()): T {
  // check if obj has already cloned before (circular)
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  // new clone
  const type = typeof obj;
  if (type === 'object' && obj !== null) {
    // array
    if (Array.isArray(obj)) {
      const newObj = [] as T;
      cache.set(obj, newObj);
      obj.forEach((v, i) => {
        newObj[i] = cloneR(v, cache);
      });
      return newObj;
    }
    // other object
    const newObj = {} as T;
    cache.set(obj, newObj);
    Object.keys(obj).forEach((k) => {
      newObj[k] = cloneR(obj[k], cache);
    });
    return newObj;
  }
  // basic type
  return obj;
}

/**
 * 递归克隆变量
 * @param {object} obj 要复制的变量
 * @returns {object} 克隆得到的新变量
 */
export const clone = <T extends CloneableType = CloneableType>(obj: T): T => cloneR(obj);

// export const clone = obj => JSON.parse(JSON.stringify(obj));

/**
 * 解码 JSON 数据
 * @param {string} str 编码的 JSON 串
 * @returns {object | undefined} 解码成功的数据 或解码失败返回 undefined
 */
export function decodeJson<T = unknown>(str: string): T | undefined {
  try {
    return JSON.parse(str);
  } catch (e) {
    return void 0;
  }
}

export const encodeJson = <T = unknown>(obj: T): string => JSON.stringify(obj);

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
export function equals<T1 = unknown, T2 = unknown>(p1: T1, p2: T2, {
  ignoreKeys = [],
  ignoreValues = [],
  judgeKeys = [],
  strictType = true,
}: {
  ignoreKeys?: PropKey[];
  ignoreValues?: unknown[];
  judgeKeys?: PropKey[];
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

export const concatPath = (...paths): string => {
  const res = paths.map((path, i) => {
    if (i === 0) {
      return path.replace(/([^/])\/+$/gu, '$1');
    }
    if (i === paths.length - 1) {
      return path.replace(/^\/+([^/])/gu, '$1');
    }
    return path.replace(/(?:^\/+|\/+$)/gu, '');
  }).filter((s, i) => s && (s !== '/' || i === 0 || i === paths.length - 1));
  if (res.length === 2 && res[0] === '/' && res[1] === '/') {
    res.pop();
  }
  if (res.length !== 1) {
    if (res[0] === '/') {
      res[0] = '';
    }
    if (res[res.length - 1] === '/') {
      res[res.length - 1] = '';
    }
  }
  return res.join('/');
};

export interface UpdateObjectInfo {
  assign?: Record<PropKey, unknown>;
  offset?: Record<PropKey, number>;
}

/**
 * 更新一个对象
 * @param {object} o 要更新的对象
 * @param {object} options 更新的参数 支持覆盖和数值加减
 * @returns {object} 原对象
 */
export function updateObject<T = unknown>(o: T, { assign, offset }: UpdateObjectInfo): T {
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
export function singletonPromise<T = unknown>(promiseGenerator: Function, idGenerator: Function): () => Promise<T> {
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

/**
 * 多任务 Promise 处理器
 * @param {Promise} promise 原始 Promise
 * @returns {Function} 创建新的处理任务的函数
 */
export function CreateMultitaskPromise<T = unknown>(promise: Promise<T>): () => Promise<T> {
  const fulfills: Function[] = [];
  const rejects: Function[] = [];
  let result!: T;
  let error;
  let status = '';

  const onFulfill = (res): void => {
    status = 'fulfilled';
    result = res;
    fulfills.forEach(f => f());
  };

  const onReject = (err): void => {
    status = 'rejected';
    error = err;
    rejects.forEach(f => f());
  };

  promise
    .then(res => onFulfill(res))
    .catch(err => onReject(err));

  /**
   * 新 Promise 任务
   * @returns {Promise} Promise 对象
   */
  return (): Promise<T> => {
    if (status === 'fulfilled') {
      return Promise.resolve(result);
    }
    if (status === 'rejected') {
      return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
      fulfills.push(resolve);
      rejects.push(reject);
    });
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
export function createObjectProxy<T = unknown>(proxy, object: T, {
  setter,
  onset,
  getter,
  keys = Object.keys(object),
}: {
  setter?: (object: T, k: PropKey, v: unknown) => void;
  onset?: (object: T, k: PropKey, v: unknown) => void;
  getter?: (object: T, k: PropKey) => void;
  keys?: PropKey[];
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

export const safeCall = (func: Function | null | undefined, ...args): void => {
  try {
    if (func) {
      func(...args);
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 根据 Picker 选择器数据，和当前值，计算选择器下标数组
 * @param {PickerData} pickerData 选择器数据
 * @param {unknown} value 选中值
 * @returns {number[]} 选中下标
 */
export const findPickerIndex = (pickerData: PickerGroupData, value: unknown): number[] => {
  let selectedIndex = [0];
  const selectedNodes = [pickerData.options[0]];
  while (selectedNodes.length) {
    const node = selectedNodes[selectedNodes.length - 1];
    if (node) {
      if (node.children && node.children.options.length) { // 有子节点
        selectedIndex.push(0);
        selectedNodes.push(node.children.options[0]);
      } else if (node.value === value) { // 找到节点
        break;
      } else { // 不匹配尝试下一个
        selectedIndex[selectedIndex.length - 1] += 1;
        if (selectedNodes.length === 1) {
          selectedNodes[selectedNodes.length - 1] = pickerData.options[selectedIndex[selectedIndex.length - 1]];
        } else {
          const item = selectedNodes[selectedNodes.length - 2];
          if (!item.children) { // 理论上不可能走到这里
            throw new Error('Parent cannot be leaf node!');
          }
          selectedNodes[selectedNodes.length - 1] = item.children.options[selectedIndex[selectedIndex.length - 1]];
        }
      }
    } else if (selectedIndex.length <= 2) { // 一级分组切换
      if (selectedIndex.length === 2) {
        selectedIndex.pop();
        selectedNodes.pop();
      }
      selectedIndex[0] += 1;
      selectedNodes[0] = pickerData.options[selectedIndex[0]];
      if (!selectedNodes[0]) { // 找不到
        selectedIndex = [];
        break;
      }
    } else { // 次级分组切换
      selectedIndex.pop();
      selectedNodes.pop();
      selectedIndex[selectedIndex.length - 1] += 1;
      const item = selectedNodes[selectedNodes.length - 1];
      if (!item.children) { // 理论上不可能走到这里
        throw new Error('Parent cannot be leaf node!');
      }
      selectedNodes[selectedNodes.length - 1] = item.children.options[selectedIndex[selectedIndex.length - 1]];
    }
  }
  return selectedIndex;
};

export const randomChild = <T = unknown>(list: T[]): T => list[Math.floor(Math.random() * list.length) % list.length];
