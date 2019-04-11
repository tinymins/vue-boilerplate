
/**
* This file is part of vue-boilerplate.
* @link     : https://zhaiyiming.com/
* @author   : Emil Zhai (root@derzh.com)
* @modifier : Emil Zhai (root@derzh.com)
* @copyright: Copyright (c) 2018 TINYMINS.
*/
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { getElementPath } from '@/utils/util';

/**
 * 页面选中控制器
 */
class ViewportControl {
  /**
   * 事件注册标志位
   */
  private static registered = false;

  /**
   * 当前选中文字
   */
  private static selectionText = '';

  /**
   * 当前选中状态变化
   */
  private static selectionChanged = false;

  /**
   * 是否禁止选中
   */
  private static selectionForbidden = false;

  /**
   * 是否禁止菜单
   */
  private static contextmenuForbidden = false;

  /**
   * 是否禁止双指缩放
   */
  private static gestureForbidden = false;

  /**
   * 侦听器的优先级参数，在捕获阶段进行侦听
   */
  private static readonly CAPTURE_EVENT = { capture: true, passive: false, once: false };

  /**
   * 判断一个 DOM 元素是否允许选中
   * @param {HTMLElement} el DOM 元素
   * @returns {void}
   */
  private static isSelectableEl(el: HTMLElement | null): boolean {
    if (ViewportControl.selectionForbidden) {
      if (el) {
        return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
          || getElementPath(el).some($dom => $dom.attributes && $dom.attributes['allow-user-select']);
      }
      return false;
    }
    return true;
  }

  /**
   * 缩放事件处理函数
   * @param {Event} e 事件参数
   * @returns {void}
   */
  private static onGestureStart(e: Event): boolean {
    if (!ViewportControl.gestureForbidden) {
      return true;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  /**
   * 菜单事件处理函数
   * @param {Event} e 事件参数
   * @returns {void}
   */
  private static onContextMenuEvent(e: Event): boolean {
    if (!ViewportControl.contextmenuForbidden) {
      return true;
    }
    const contextable = !getElementPath(e.target).some($dom => $dom.attributes && $dom.attributes['disable-context-menu']);
    if (!contextable) {
      e.preventDefault();
      e.stopPropagation();
    }
    return contextable;
  }

  /**
   * 鼠标按下事件处理函数
   * @param {MouseEvent} e 事件参数
   * @returns {void}
   */
  private static onMouseDown(e: MouseEvent): boolean {
    const selectable = ViewportControl.isSelectableEl(e.target as HTMLElement);
    if (!selectable) {
      e.preventDefault();
      e.stopPropagation();
    }
    return selectable;
  }

  /**
   * 选中开始事件处理函数
   * @param {Event} e 事件参数
   * @returns {void}
   */
  private static onSelectionStart(e: Event): boolean {
    if (!ViewportControl.selectionForbidden) {
      return true;
    }
    const selectable = ViewportControl.isSelectableEl(e.target as HTMLElement);
    if (!selectable) {
      e.preventDefault();
      e.stopPropagation();
    }
    return selectable;
  }

  /**
   * 选中事件处理函数
   * @returns {void}
   */
  private static onSelectionChange(): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const text = selection.toString();
    if (text && text !== ViewportControl.selectionText) {
      ViewportControl.selectionChanged = true;
    }
    ViewportControl.selectionText = text;
  }

  /**
   * 点击事件处理函数
   * @param {MouseEvent} e 事件参数
   * @returns {void}
   */
  private static onClick(e: MouseEvent): void {
    if (ViewportControl.selectionChanged) {
      e.preventDefault();
      e.stopPropagation();
    }
    ViewportControl.selectionChanged = false;
  }

  /**
   * 注册事件
   * @returns {void}
   */
  public static registerEvent(): void {
    if (ViewportControl.registered) {
      return;
    }
    ViewportControl.registered = true;
    document.addEventListener('click', ViewportControl.onClick, ViewportControl.CAPTURE_EVENT);
    document.addEventListener('mousedown', ViewportControl.onMouseDown, ViewportControl.CAPTURE_EVENT);
    document.addEventListener('gesturestart', ViewportControl.onGestureStart, ViewportControl.CAPTURE_EVENT);
    document.addEventListener('contextmenu', ViewportControl.onContextMenuEvent, ViewportControl.CAPTURE_EVENT);
    document.addEventListener('selectstart', ViewportControl.onSelectionStart, ViewportControl.CAPTURE_EVENT);
    document.addEventListener('selectionchange', ViewportControl.onSelectionChange, ViewportControl.CAPTURE_EVENT);
  }

  /**
   * 注销事件
   * @returns {void}
   */
  public static removeEvent(): void {
    if (!ViewportControl.registered) {
      return;
    }
    ViewportControl.registered = false;
    document.removeEventListener('click', ViewportControl.onClick);
    document.removeEventListener('mousedown', ViewportControl.onMouseDown);
    document.removeEventListener('gesturestart', ViewportControl.onGestureStart);
    document.removeEventListener('contextmenu', ViewportControl.onContextMenuEvent);
    document.removeEventListener('selectstart', ViewportControl.onSelectionStart);
    document.removeEventListener('selectionchange', ViewportControl.onSelectionChange);
  }

  /**
   * 禁用缩放
   * @returns {void}
   */
  public static disableZoom(): void {
    ViewportControl.gestureForbidden = true;
  }

  /**
   * 允许缩放
   * @returns {void}
   */
  public static enableZoom(): void {
    ViewportControl.gestureForbidden = false;
  }

  /**
   * 禁用页面选中
   * @returns {void}
   */
  public static disableSelection(): void {
    ViewportControl.selectionForbidden = true;
    ViewportControl.contextmenuForbidden = true;
  }

  /**
   * 允许页面选中
   * @returns {void}
   */
  public static enableSelection(): void {
    ViewportControl.selectionForbidden = false;
    ViewportControl.contextmenuForbidden = false;
  }

  /**
   * 初始化
   * @returns {void}
   */
  public static init(): void {
    ViewportControl.registerEvent();
  }
}

export default ViewportControl;
