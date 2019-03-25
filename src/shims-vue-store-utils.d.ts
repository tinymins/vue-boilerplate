/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
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
    $pushToast: any,
    $popToast: any,
    $showDialog: any,
    $hideDialog: any,
    $pushActionsheet: any,
    $popActionsheet: any,
  }
}
