/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';

import * as utils from './store/utils';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $wechat: any;
    readonly $setPageTitle: utils.TSetPageTitleVueIns;
    readonly $setPageShare: utils.TSetPageShareVueIns;
    readonly $setFooterExtraHeight: utils.TSetFooterExtraHeightVueIns;
    readonly $removeFooterExtraHeight: utils.TRemoveFooterExtraHeightVueIns;
    readonly $setHeaderExtraHeight: utils.TSetHeaderExtraHeightVueIns;
    readonly $removeHeaderExtraHeight: utils.TRemoveHeaderExtraHeightVueIns;
    readonly $showLoading: utils.TShowLoadingVueIns;
    readonly $hideLoading: utils.THideLoadingVueIns;
    readonly $showToast: utils.TShowToastVueIns;
    readonly $hideToast: utils.THideToastVueIns;
    readonly $showDialog: utils.TShowDialogVueIns;
    readonly $hideDialog: utils.THideDialogVueIns;
    readonly $showActionsheet: utils.TShowActionsheetVueIns;
    readonly $hideActionsheet: utils.THideActionsheetVueIns;
    readonly $showPicker: utils.TShowPickerVueIns;
    readonly $hidePicker: utils.THidePickerVueIns;
  }
}
