/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

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
