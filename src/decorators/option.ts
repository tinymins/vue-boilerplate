/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
 */
/* eslint no-param-reassign: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */

import { createDecorator } from 'vue-class-component';

/**
 * decorator of model
 * @param {any}  value option value
 * @return {Function} VueDecorator
 */
export default function Option(value): Function {
  return createDecorator((componentOptions: Record<string, any>, k) => {
    if (!componentOptions.options) {
      componentOptions.options = {};
    }
    componentOptions.options[k] = value;
  });
}
