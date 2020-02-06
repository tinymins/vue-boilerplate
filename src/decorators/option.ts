/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { createDecorator } from 'vue-class-component';
import { ComponentOptionsOptions } from '@/shims-vue-options.d';

/**
 * decorator of model
 * @param {any}  value option value
 * @return {Function} VueDecorator
 */
export default function Option(value): Function {
  return createDecorator((componentOptions: { options?: ComponentOptionsOptions }, k) => {
    if (!componentOptions.options) {
      componentOptions.options = {};
    }
    componentOptions.options[k] = value;
  });
}
