/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { PropKey } from '@/types';
import { clone } from './util';

const arrayToObject = (a: PropKey[]): Record<PropKey, unknown> => {
  const o = {};
  a.forEach((k) => {
    o[k] = true;
  });
  return o;
};

/**
 * 递归处理对象配置项
 */
export interface RecursiveAssignObjectOptions {
  /**
   * 是否修改原对象
   */
  modify?: boolean;
  /**
   * 是否转化键
   */
  key?: boolean | null;
  /**
   * 想要转化的键留空表示所有
   */
  keys?: string[];
  /**
   * 是否转化值
   */
  value?: boolean | null;
  /**
   * 想要转化的值留空表示所有
   */
  values?: string[];
}

const recursiveAssignObject = <T extends object = object>(obj: T, options, cache = new Map()): T => {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  if (typeof obj === 'object' && obj !== null) {
    cache.set(obj, obj); // forbid circular object
    Object.keys(obj).forEach((k) => {
      // must process children first, cause key may get changed later
      obj[k] = recursiveAssignObject(obj[k], options, cache);
      // process key
      if (options.key) {
        const newK = options.key(k);
        if (newK !== k && (!options.keys || options.keys[k] || options.keys[newK])) {
          obj[newK] = obj[k];
          delete obj[k];
        }
      }
    });
    return obj;
  }
  if (typeof obj === 'string' && options.value) {
    const res = options.value(obj);
    if (!options.values || options.values[obj] || options.values[res]) {
      cache.set(obj, res);
      return res;
    }
  }
  cache.set(obj, obj);
  return obj;
};

/**
 * 将一个字符串转化为小驼峰形式
 * @param {string} str 源字符串
 * @returns {string} 结果字符串
 */
export const camelizeString = (str: string): string => str.split('_').map((s, i) => (
  i === 0
    ? s.substring(0, 1).toLowerCase()
    : s.substring(0, 1).toUpperCase())
  + (s.toUpperCase() === s
    ? s.substring(1).toLowerCase()
    : s.substring(1))).join('');

/**
 * 将一个对象转化为小驼峰形式
 * @param {object} obj 源对象
 * @param {object} opts 配置项
 * @returns {object} 结果对象
 */
export const camelize = <T extends object = object>(obj, opts: RecursiveAssignObjectOptions = {}): T => {
  const res: T = opts.modify ? obj : clone(obj);
  const options = {
    key: opts.key === true || opts.key === void 0 || opts.keys ? camelizeString : null,
    keys: opts.keys ? arrayToObject(opts.keys) : null,
    value: opts.value || opts.values ? camelizeString : null,
    values: opts.values ? arrayToObject(opts.values) : null,
  };
  return recursiveAssignObject(res, options);
};

/**
 * 将一个字符串转化为下划线形式
 * @param {string} str 源字符串
 * @returns {string} 结果字符串
 */
export const snakelizeString = (str: string): string => str.split(/(?=[A-Z])/u).map(p => p.toLowerCase()).join('_');

/**
 * 将一个对象转化为下划线形式
 * @param {object} obj 源对象
 * @param {object} opts 配置项
 * @returns {object} 结果对象
 */
export const snakelize = <T extends object = object>(obj, opts: RecursiveAssignObjectOptions = {}): T => {
  const res: T = opts.modify ? obj : clone(obj);
  const options = {
    key: opts.key === true || opts.key === void 0 || opts.keys ? snakelizeString : null,
    keys: opts.keys ? arrayToObject(opts.keys) : null,
    value: opts.value ? snakelizeString : null,
    values: opts.values ? arrayToObject(opts.values) : null,
  };
  return recursiveAssignObject(res, options);
};

/**
 * 将一个字符串转化为大驼峰形式
 * @param {string} str 源字符串
 * @returns {string} 结果字符串
 */
export const pascalizeString = (str: string): string => str.split('_').map(s => s.substring(0, 1).toUpperCase() + s.substring(1)).join('');

/**
 * 将一个对象转化为大驼峰形式
 * @param {object} obj 源对象
 * @param {object} opts 配置项
 * @returns {object} 结果对象
 */
export const pascalize = <T extends object = object>(obj, opts: RecursiveAssignObjectOptions = {}): T => {
  const res: T = opts.modify ? obj : clone(obj);
  const options = {
    key: opts.key === true || opts.key === void 0 || opts.keys ? pascalizeString : null,
    keys: opts.keys ? arrayToObject(opts.keys) : null,
    value: opts.value ? pascalizeString : null,
    values: opts.values ? arrayToObject(opts.values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const replaceObjectKey = (oriObj, keymaps: Record<PropKey, PropKey>): Record<PropKey, PropKey> => {
  const obj: Record<PropKey, PropKey> = clone(oriObj);
  Object.entries(keymaps).forEach(([k, v]) => {
    obj[v] = obj[k];
    delete obj[k];
  });
  return obj;
};

export interface GalleryItemData {
  thumbnail: string;
  original: string;
  title?: string;
}

export const imagesToGallery = (images: { url: string; title?: string }[]): GalleryItemData[] => images.map(image => ({
  thumbnail: image.url,
  original: image.url.replace(/\/small(?=\.jpg$|$)/gu, ''),
  title: image.title,
}));

export const htmlEscape = (s): string => {
  const $div = document.createElement('div');
  $div.innerText = s;
  return $div.innerHTML.replace(/\s/igu, '&nbsp;');
};

export const formatCounter = (num, zero = num): string | number => {
  if (num >= 100000) {
    return `${Math.floor(num / 10000)}w`;
  }
  if (num >= 10000) {
    return `${Math.floor(num / 1000) / 10}w`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 100) / 10}k`;
  }
  if (num > 0) {
    return num;
  }
  return zero;
};

export const cleanObject = (obj, ks = [void 0, null]): Record<PropKey, unknown> => {
  const ret = {};
  Object.keys(obj).forEach((k) => {
    if (!ks.includes(obj[k])) {
      ret[k] = obj[k];
    }
  });
  return ret;
};

const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
const chnUnitChar = ['', '十', '百', '千'];
const SectionToChinese = (section): string => {
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    const v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos += 1;
    section = Math.floor(section / 10);
  }
  return chnStr;
};
export const numberToChinese = (num): string => {
  let unitPos = 0;
  let strIns = '';
  let chnStr = '';
  let needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    const section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += section === 0 ? chnUnitSection[0] : chnUnitSection[unitPos];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos += 1;
  }

  return chnStr.replace(/^一十/igu, '十'); // 避免出现“一十一”
};

export const mosaicString = (str: string, prefixLen: number, suffixLen: number): string => {
  const len = str.length;
  const plainLen = len - prefixLen - suffixLen;
  if (plainLen <= 0) {
    return '*'.repeat(prefixLen + suffixLen);
  }
  return `${str.substr(0, prefixLen)}${'*'.repeat(plainLen)}${str.substr(str.length - suffixLen)}`;
};
