/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $setHeaderTitle: any,
    $setWechatShare: any,
    $setFooterExtraHeight: any,
    $removeFooterExtraHeight: any,
    $setHeaderExtraHeight: any,
    $removeHeaderExtraHeight: any,
    $showLoading: any,
    $hideLoading: any,
    $showToast: any,
    $hideToast: any,
    $showDialog: any,
    $hideDialog: any,
    $showActionsheet: any,
    $hideActionsheet: any,
    $showPicker: any,
    $HidePicker: any,
  }
}
