/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { RawLocation } from 'vue-router';

/**
 * 路由异常
 */
export class RouterError extends Error {
  public type: string;
  public redirect?: RawLocation;

  /**
   * 创建路由异常
   * @param {'REDIRECT'} type 异常类型：重定向异常
   * @param {RawLocation} redirect 重定向地址
   * @returns {RouterError} 异常对象
   */
  public constructor(type: 'REDIRECT', redirect: RawLocation) {
    super(type);
    this.type = type;
    this.redirect = redirect;
  }
}
