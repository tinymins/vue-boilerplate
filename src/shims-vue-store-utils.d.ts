/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue'
import * as utils from './store/utils';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $wechat: any;
    readonly $setPageTitle: typeof utils.setPageTitle;
    readonly $setPageShare: typeof utils.setPageShare;
    readonly $setFooterExtraHeight: typeof utils.setFooterExtraHeight;
    readonly $removeFooterExtraHeight: typeof utils.removeFooterExtraHeight;
    readonly $setHeaderExtraHeight: typeof utils.setHeaderExtraHeight;
    readonly $removeHeaderExtraHeight: typeof utils.removeHeaderExtraHeight;
    readonly $showLoading: typeof utils.showLoading;
    readonly $hideLoading: typeof utils.hideLoading;
    readonly $showToast: typeof utils.showToast;
    readonly $hideToast: typeof utils.hideToast;
    readonly $showDialog: typeof utils.showDialog;
    readonly $hideDialog: typeof utils.hideDialog;
    readonly $showActionsheet: typeof utils.showActionsheet;
    readonly $hideActionsheet: typeof utils.hideActionsheet;
    readonly $showPicker: typeof utils.showPicker;
    readonly $hidePicker: typeof utils.hidePicker;
  }
}
