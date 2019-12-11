/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

/**
 * Store 数据缓存列表
 */
export interface StoreDataCache<T = unknown> {
  id: string;
  data: T;
}

type Identifier = string | number | object;
const stringifyIdentifier = (id: Identifier): string => {
  if (typeof id === 'string') {
    return id;
  }
  if (typeof id === 'number') {
    return id.toString();
  }
  const parts: string[] = [];
  if (typeof id === 'object') {
    Object.keys(id).sort().forEach((k) => {
      const v = id[k];
      if (v !== null && v !== void 0 && v !== '') {
        parts.push(`${String(k)}: ${String(v)}`);
      }
    });
  }
  return parts.join(', ');
};

/**
 * 通过标识符命中缓存项
 * @param {StoreDataCache<T>[]} cacheList 缓存列表
 * @param {Identifier} id 标识符
 * @returns {T | undefined} 命中则返回结果
 */
export const findCache = <T = unknown>(cacheList: StoreDataCache<T>[], id: Identifier): T | undefined => {
  const sid = stringifyIdentifier(id);
  const cache = cacheList.find(c => c.id === sid);
  return cache ? cache.data : void 0;
};

/**
 * 新数据加入缓存
 * @param {StoreDataCache<T>[]} cacheList 缓存列表
 * @param {Identifier} id 标识符
 * @param {T} data 新数据
 * @param {number} maxCount 最大缓存数量
 * @returns {void}
 */
export const saveCache = <T = unknown>(cacheList: StoreDataCache<T>[], id: Identifier, data: T, maxCount: number = 10): void => {
  const sid = stringifyIdentifier(id);
  const index = cacheList.findIndex(c => c.id === sid);
  if (index >= 0) {
    cacheList.splice(index, 1);
  } else if (cacheList.length > maxCount) {
    cacheList.shift();
  }
  cacheList.push({ id: sid, data });
};
