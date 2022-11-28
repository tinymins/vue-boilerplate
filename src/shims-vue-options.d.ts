/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';

export interface ComponentOptionsOptions {
  hideTabbar?: boolean;
  hideNavbar?: boolean;
  bodyAutoHeight?: boolean;
  bodyBackground?: string | Record<string, string>;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    uses?: any[];
    onWechatReady?: () => void;
    options?: ComponentOptionsOptions;
  }
}
