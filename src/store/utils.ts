/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import uuidv1 from 'uuid/v1';
import store from '@/store';
import { COMMON } from '@/store/types';
import { Route } from 'vue-router';

type UniqueID = symbol | string | number;

/**
 * 设置文档标题，可传入包含路由的对象进行标题缓存操作（可防止返回时标题闪烁）
 * @param {string|object} arg 标题/包含标题和路由的对象
 * @returns {void}
 */
export const setHeaderTitle = (arg: string | { route?: Route; text: string }): void => store.commit(`common/${COMMON.SET_HEADER_TITLE}`, arg);

/**
 * 设置微信分享信息
 * @param {object} arg 分享参数
 * @returns {void}
 */
export const setWechatShare = (arg: {
  title: string;
  desc?: string;
  link?: string;
  route?: Route;
  imgUrl?: string;
  overwrite?: boolean;
  success?: (() => void);
  cancel?: (() => void);
}): void => store.commit(`common/${COMMON.SET_WECHAT_SHARE}`, arg);

/**
 * 添加/设置显示区域顶部空白高度
 * @param {UniqueID} arg 高度参数
 * @returns {void}
 */
export const setHeaderExtraHeight = (arg: {
  id: UniqueID;
  index?: number;
  height: number | string;
}): void => store.commit(`common/${COMMON.SET_HEADER_EXTRA_HEIGHT}`, arg);

/**
 * 根据唯一标识符删除显示区域顶部空白
 * @param {UniqueID} arg 高度参数 arg.id 唯一标识符
 * @returns {void}
 */
export const removeHeaderExtraHeight = (arg: { id: UniqueID }): void => store.commit(`common/${COMMON.REMOVE_HEADER_EXTRA_HEIGHT}`, arg);

/**
 * 添加/设置显示区域底部空白高度
 * @param {object} arg 高度参数
 * @returns {void}
 */
export const setFooterExtraHeight = (arg: {
  id: UniqueID;
  index?: number;
  height: number | string;
}): void => store.commit(`common/${COMMON.SET_FOOTER_EXTRA_HEIGHT}`, arg);

/**
 * 根据唯一标识符删除显示区域底部空白
 * @param {UniqueID} arg 高度参数 arg.id 唯一标识符
 * @returns {void}
 */
export const removeFooterExtraHeight = (arg: { id: UniqueID }): void => store.commit(`common/${COMMON.REMOVE_FOOTER_EXTRA_HEIGHT}`, arg);

/**
 * 显示加载中遮罩层
 * @param {object} param0 加载中遮罩层参数
 * @returns {UniqueID} 加载中遮罩层唯一标识符
 */
export const showLoading = ({ id = Symbol('Loading'), ...params }: { id?: UniqueID; text?: string } = {}): UniqueID => {
  store.commit(`common/${COMMON.SHOW_LOADING}`, { id, ...params });
  return id;
};

/**
 * 隐藏加载中遮罩层
 * @param {object} arg 加载中遮罩层参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideLoading = (arg: { id?: UniqueID }): void => store.commit(`common/${COMMON.HIDE_LOADING}`, arg);

/**
 * 显示浮动弹出消息
 * @param {object} param0 消息参数
 * @returns {UniqueID} 消息唯一标识符
 */
export const showToast = ({ id, ...params }: {
  id?: UniqueID;
  text: string;
  time?: number;
  type?: string;
  position?: string;
  width?: string | number;
}): UniqueID => {
  if (id === void 0) {
    id = uuidv1() as string;
  }
  store.commit(`common/${COMMON.SHOW_TOAST}`, { id, ...params });
  return id;
};

/**
 * 隐藏浮动弹出消息
 * @param {object} arg 浮动弹出消息参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideToast = (arg: { id?: UniqueID }): void => store.commit(`common/${COMMON.HIDE_TOAST}`, arg);

/**
 * 显示对话框
 * @param {object} param0 对话框参数
 * @returns {UniqueID} 对话框唯一标识符
 */
export const showDialog = ({ id, ...params }: {
  id?: UniqueID;
  type?: string;
  title?: string;
  content: string;
  onclose?: Function;
  buttons?: {
    label: string;
    primary?: boolean;
    action?: Function;
  }[];
}): UniqueID => {
  if (id === void 0) {
    id = Symbol('Dialog');
  }
  store.commit(`common/${COMMON.SHOW_DIALOG}`, { id, ...params });
  return id;
};

/**
 * 隐藏对话框
 * @param {object} arg 对话框参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideDialog = (arg: { id?: UniqueID }): void => store.commit(`common/${COMMON.HIDE_DIALOG}`, arg);

/**
 * 显示弹出菜单
 * @param {object} param0 弹出菜单参数
 * @returns {UniqueID} 弹出菜单唯一标识符
 */
export const showActionsheet = ({ id = Symbol('Actionsheet'), ...params }: {
  id: UniqueID;
  title?: string;
  data: any;
  handler?: Function;
}): UniqueID => {
  store.commit(`common/${COMMON.SHOW_ACTIONSHEET}`, { id, ...params });
  return id;
};

/**
 * 隐藏弹出菜单
 * @param {object} arg 弹出菜单参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hideActionsheet = (arg: { id?: UniqueID }): void => store.commit(`common/${COMMON.HIDE_ACTIONSHEET}`, arg);

/**
 * 显示弹出滚动选择框
 * @param {object} param0 弹出滚动选择参数
 * @returns {UniqueID} 弹出滚动选择唯一标识符
 */
export const showPicker = ({ id = Symbol('Picker'), ...params }: {
  id: UniqueID;
  title?: string;
  data: any;
  handler?: Function;
}): UniqueID => {
  store.commit(`common/${COMMON.SHOW_PICKER}`, { id, ...params });
  return id;
};

/**
 * 隐藏弹出滚动选择框
 * @param {object} arg 弹出滚动选择参数 arg.id 唯一标识符
 * @returns {void}
 */
export const hidePicker = (arg: { id?: UniqueID }): void => store.commit(`common/${COMMON.HIDE_PICKER}`, arg);

const install = (Vue): void => {
  Object.entries({
    setHeaderTitle,
    setWechatShare,
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
    Vue.prototype[`$${k}`] = v;
  });
};

export default { install };
