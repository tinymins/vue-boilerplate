/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { BasicUniqueObject } from '@/types';

/**
 * Picker 一个选择项信息
 */
export interface PickerItemData<TV = unknown, TD = unknown> {
  label: string;
  value: TV;
  color?: string;
  bgColor?: string;
  data?: TD;
  children?: PickerGroupData<TV, TD>;
}

/**
 * Picker 一列选择项描述信息
 */
export interface PickerGroupData<TV = unknown, TD = unknown> {
  /** 该列顶部标题 */
  title?: string;
  /** 该列所有选项 */
  options: PickerItemData<TV, TD>[];
}

/**
 * Picker 所有配置项
 */
export interface PickerData<TV = unknown, TD = unknown> extends BasicUniqueObject {
  /** 标题 */
  title?: string;
  /** 选项数据 */
  data: PickerGroupData<TV, TD>;
  /** 类型 picker-cascade：级联选择器 picker-tags：多项选择器 */
  type?: 'picker-cascade' | 'picker-tags';
  /** 布局行数（多选状态） */
  columns?: number;
  /** 最大选择数量（多选状态） */
  maxLimit?: number;
  /** 当前选中值 */
  value?: TV[];
  /** 确认选择回调 */
  handler?: (item: PickerItemData<TV, TD>[]) => void;
  /** 取消选择回调 */
  oncancel?: () => void;
  /** 关闭时回调 */
  onclose?: () => void;
}
