/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

/**
 * 将一个字符串转化为小驼峰形式
 * @param str 源字符串
 * @returns 结果字符串
 */
export const camelizeString = (str: string): string => str.split('_').map((s, i) => (
  i === 0
    ? s.slice(0, 1).toLowerCase()
    : s.slice(0, 1).toUpperCase())
  + (s.toUpperCase() === s
    ? s.slice(1).toLowerCase()
    : s.slice(1))).join('');

/**
 * 将一个字符串转化为下划线形式
 * @param str 源字符串
 * @returns 结果字符串
 */
export const snakelizeString = (str: string): string => str.split(/(?=[A-Z])/u).map(p => p.toLowerCase()).join('_');

/**
 * 将一个字符串转化为大驼峰形式
 * @param str 源字符串
 * @returns 结果字符串
 */
export const pascalizeString = (str: string): string => str.split('_').map(s => s.slice(0, 1).toUpperCase() + s.slice(1)).join('');

/**
 * 将一个字符串转化为打码状态
 * @param str 源字符串
 * @param prefixLen 前缀长度
 * @param suffixLen 后缀长度
 * @returns 结果字符串
 */
export const mosaicString = (str: string, prefixLen: number, suffixLen: number): string => {
  const len = str.length;
  const plainLen = len - prefixLen - suffixLen;
  if (plainLen <= 0) {
    return '*'.repeat(prefixLen + suffixLen);
  }
  return `${str.slice(0, Math.max(0, prefixLen))}${'*'.repeat(plainLen)}${str.slice(str.length - suffixLen)}`;
};
