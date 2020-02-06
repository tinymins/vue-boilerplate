/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';
import { OmitFirstArg } from './types';
import * as utils from './store/utils';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $wechat: any;
    readonly $setPageTitle: OmitFirstArg<typeof utils.setPageTitle>;
    readonly $setPageShare: OmitFirstArg<typeof utils.setPageShare>;
    readonly $setFooterExtraHeight: OmitFirstArg<typeof utils.setFooterExtraHeight>;
    readonly $removeFooterExtraHeight: OmitFirstArg<typeof utils.removeFooterExtraHeight>;
    readonly $setHeaderExtraHeight: OmitFirstArg<typeof utils.setHeaderExtraHeight>;
    readonly $removeHeaderExtraHeight: OmitFirstArg<typeof utils.removeHeaderExtraHeight>;
    readonly $showLoading: OmitFirstArg<typeof utils.showLoading>;
    readonly $hideLoading: OmitFirstArg<typeof utils.hideLoading>;
    readonly $showToast: OmitFirstArg<typeof utils.showToast>;
    readonly $hideToast: OmitFirstArg<typeof utils.hideToast>;
    readonly $showDialog: OmitFirstArg<typeof utils.showDialog>;
    readonly $hideDialog: OmitFirstArg<typeof utils.hideDialog>;
    readonly $showActionsheet: OmitFirstArg<typeof utils.showActionsheet>;
    readonly $hideActionsheet: OmitFirstArg<typeof utils.hideActionsheet>;
    readonly $showPicker: OmitFirstArg<typeof utils.showPicker>;
    readonly $hidePicker: OmitFirstArg<typeof utils.hidePicker>;
  }
}
