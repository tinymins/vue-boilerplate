/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import uuidv1 from 'uuid/v1';
import { UniqueID } from '@/types';
import { StoreInstance } from '@/store';
import { COMMON } from '@/store/types';
import { ShareData } from '@/utils/connect';
import { ToastData } from '@/views/common/static/components/toast-handler';
import { DialogData } from '@/views/common/static/components/dialog-handler';
import { PickerData } from '@/views/common/static/components/picker-handler/types';
import { ActionsheetData } from '@/views/common/static/components/actionsheet-handler';
import { PageTitleData, HidePickerData, HideActionsheetData, HideDialogParams, HideToastParams, ExtraHeightParams, RemoveExtraHeightParams } from './common/bus';

/**
 * 设置文档标题，可传入包含路由的对象进行标题缓存操作（可防止返回时标题闪烁）
 * @param {Store} store Store对象
 * @param {string|object} arg 标题/包含标题和路由的对象
 * @returns {void}
 */
export const setPageTitle = (store: StoreInstance, arg: PageTitleData): void => store.commit(`common/bus/${COMMON.SET_PAGE_TITLE}`, arg);

/**
 * 设置微信分享信息
 * @param {Store} store Store对象
 * @param {object} arg 分享参数
 * @returns {void}
 */
export const setPageShare = (store: StoreInstance, arg: ShareData = {}): void => store.commit(`common/bus/${COMMON.SET_PAGE_SHARE}`, Object.assign({
  route: store.state.common.route.current || store.state.common.route.to,
}, arg));

/**
 * 添加/设置显示区域顶部空白高度
 * @param {Store} store Store对象
 * @param {UniqueID} arg 高度参数
 * @returns {void}
 */
export const setHeaderExtraHeight = (store: StoreInstance, arg: ExtraHeightParams): void => store.commit(`common/bus/${COMMON.SET_HEADER_EXTRA_HEIGHT}`, arg);

/**
 * 根据唯一标识符删除显示区域顶部空白
 * @param {Store} store Store对象
 * @param {UniqueID} arg 高度参数 arg.id 唯一标识符
 * @returns {void}
 */
export const removeHeaderExtraHeight = (store: StoreInstance, arg: RemoveExtraHeightParams): void => store.commit(`common/bus/${COMMON.REMOVE_HEADER_EXTRA_HEIGHT}`, arg);

/**
 * 添加/设置显示区域底部空白高度
 * @param {Store} store Store对象
 * @param {object} arg 高度参数
 * @returns {void}
 */
export const setFooterExtraHeight = (store: StoreInstance, arg: ExtraHeightParams): void => store.commit(`common/bus/${COMMON.SET_FOOTER_EXTRA_HEIGHT}`, arg);

/**
 * 根据唯一标识符删除显示区域底部空白
 * @param {Store} store Store对象
 * @param {UniqueID} arg 高度参数 arg.id 唯一标识符
 * @returns {void}
 */
export const removeFooterExtraHeight = (store: StoreInstance, arg: RemoveExtraHeightParams): void => store.commit(`common/bus/${COMMON.REMOVE_FOOTER_EXTRA_HEIGHT}`, arg);

/**
 * 显示加载中遮罩层
 * @param {Store} store Store对象
 * @param {object} param0 加载中遮罩层参数
 * @returns {UniqueID} 加载中遮罩层唯一标识符
 */
export const showLoading = (store: StoreInstance, { id = Symbol('Loading'), ...params }: { id?: UniqueID; text?: string } = {}): UniqueID => {
  store.commit(`common/bus/${COMMON.SHOW_TOAST}`, { id, type: 'loading', time: 0, ...params });
  return id;
};

/**
 * 隐藏加载中遮罩层
 * @param {Store} store Store对象
 * @param {object} arg 加载中遮罩层参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideLoading = (store: StoreInstance, arg: HideToastParams): void => store.commit(`common/bus/${COMMON.HIDE_TOAST}`, arg);

/**
 * 显示浮动弹出消息
 * @param {Store} store Store对象
 * @param {object} param0 消息参数
 * @returns {UniqueID} 消息唯一标识符
 */
export const showToast = (store: StoreInstance, { id, ...params }: ToastData): UniqueID => {
  if (id === void 0) {
    id = uuidv1() as string;
  }
  store.commit(`common/bus/${COMMON.SHOW_TOAST}`, { id, ...params });
  return id;
};

/**
 * 隐藏浮动弹出消息
 * @param {Store} store Store对象
 * @param {object} arg 浮动弹出消息参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideToast = (store: StoreInstance, arg: HideToastParams): void => store.commit(`common/bus/${COMMON.HIDE_TOAST}`, arg);

/**
 * 显示对话框
 * @param {Store} store Store对象
 * @param {object} param0 对话框参数
 * @returns {UniqueID} 对话框唯一标识符
 */
export const showDialog = (store: StoreInstance, { id, ...params }: DialogData): UniqueID => {
  if (id === void 0) {
    id = Symbol('Dialog');
  }
  store.commit(`common/bus/${COMMON.SHOW_DIALOG}`, { id, ...params });
  return id;
};

/**
 * 隐藏对话框
 * @param {Store} store Store对象
 * @param {object} arg 对话框参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideDialog = (store: StoreInstance, arg: HideDialogParams): void => store.commit(`common/bus/${COMMON.HIDE_DIALOG}`, arg);

/**
 * 显示弹出菜单
 * @param {Store} store Store对象
 * @param {object} param0 弹出菜单参数
 * @returns {UniqueID} 弹出菜单唯一标识符
 */
export const showActionsheet = (store: StoreInstance, { id = Symbol('Actionsheet'), ...params }: ActionsheetData): UniqueID => {
  store.commit(`common/bus/${COMMON.SHOW_ACTIONSHEET}`, { id, ...params });
  return id;
};

/**
 * 隐藏弹出菜单
 * @param {Store} store Store对象
 * @param {object} arg 弹出菜单参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideActionsheet = (store: StoreInstance, arg: HideActionsheetData): void => store.commit(`common/bus/${COMMON.HIDE_ACTIONSHEET}`, arg);

/**
 * 显示弹出滚动选择框
 * @param {Store} store Store对象
 * @param {object} param0 弹出滚动选择参数
 * @returns {UniqueID} 弹出滚动选择唯一标识符
 */
export const showPicker = <TV = unknown, TD = unknown>(store: StoreInstance, { id = Symbol('Picker'), ...params }: PickerData<TV, TD>): UniqueID => {
  store.commit(`common/bus/${COMMON.SHOW_PICKER}`, { id, ...params });
  return id;
};

/**
 * 隐藏弹出滚动选择框
 * @param {Store} store Store对象
 * @param {object} arg 弹出滚动选择参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hidePicker = (store: StoreInstance, arg: HidePickerData): void => store.commit(`common/bus/${COMMON.HIDE_PICKER}`, arg);

const install = (Vue): void => {
  Object.entries({
    setPageTitle,
    setPageShare,
    setFooterExtraHeight,
    removeFooterExtraHeight,
    setHeaderExtraHeight,
    removeHeaderExtraHeight,
    showLoading,
    hideLoading,
    showToast,
    hideToast,
    showDialog,
    hideDialog,
    showActionsheet,
    hideActionsheet,
    showPicker,
    hidePicker,
  }).forEach(([k, v]) => {
    Vue[k] = v;
    Vue.prototype[`$${k}`] = function storeUtil(arg: any) {
      return v(this.$store, arg);
    };
  });
};

export default { install };
