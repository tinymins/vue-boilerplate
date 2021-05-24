/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';
import { createDecorator } from 'vue-class-component';
import { VueClass } from 'vue-class-component/lib/declarations';
import { ComponentOptionsOptions } from '@/shims-vue-options.d';

/**
 * decorator of model
 * @param value option value
 * @return VueDecorator
 */
export default function Option<
  V extends Vue,
  TK extends keyof ComponentOptionsOptions
>(value: ComponentOptionsOptions[TK]): <VC extends VueClass<V>>(target: VC, k: TK) => void {
  return createDecorator((componentOptions, k) => {
    if (!componentOptions.options) {
      componentOptions.options = {};
    }
    componentOptions.options[k] = value;
  });
}
