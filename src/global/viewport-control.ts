
/**
* This file is part of vue-boilerplate.
* @link     : https://zhaiyiming.com/
* @author   : Emil Zhai (root@derzh.com)
* @modifier : Emil Zhai (root@derzh.com)
* @copyright: Copyright (c) 2018 TINYMINS.
*/

import { getElementPath } from '@/utils/util';
import { isServer } from '@/utils/environment';

/**
 * 页面选中控制器
 */
const ViewportControl = (() => {
  /**
   * 事件注册标志位
   */
  let registered = false;

  /**
   * 当前选中文字
   */
  let selectionText = '';

  /**
   * 当前选中状态变化
   */
  let selectionChanged = false;

  /**
   * 是否禁止选中
   */
  let selectionForbidden = false;

  /**
   * 是否禁止菜单
   */
  let contextmenuForbidden = false;

  /**
   * 是否禁止双指缩放
   */
  let gestureForbidden = false;

  /**
   * 侦听器的优先级参数，在捕获阶段进行侦听
   */
  const CAPTURE_EVENT = { capture: true, passive: false, once: false };

  /**
   * 判断一个 DOM 元素是否允许选中
   * @param {HTMLElement} el DOM 元素
   * @returns {void}
   */
  function isSelectableEl(el: HTMLElement | null): boolean {
    if (selectionForbidden) {
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
  function onGestureStart(e: Event): boolean {
    if (!gestureForbidden) {
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
  function onContextMenuEvent(e: Event): boolean {
    if (!contextmenuForbidden) {
      return true;
    }
    const contextable = !getElementPath(e.target as HTMLElement).some($dom => $dom.attributes && $dom.attributes['disable-context-menu']);
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
  function onMouseDown(e: MouseEvent): boolean {
    const el = e.target as HTMLElement;
    const selectable = isSelectableEl(el);
    if (!selectable) {
      e.preventDefault();
      e.stopPropagation();
    }
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && el !== activeEl) {
      activeEl.blur();
    }
    return selectable;
  }

  /**
   * 选中开始事件处理函数
   * @param {Event} e 事件参数
   * @returns {void}
   */
  function onSelectionStart(e: Event): boolean {
    if (!selectionForbidden) {
      return true;
    }
    const selectable = isSelectableEl(e.target as HTMLElement);
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
  function onSelectionChange(): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const text = selection.toString();
    if (text && text !== selectionText) {
      selectionChanged = true;
    }
    selectionText = text;
  }

  /**
   * 点击事件处理函数
   * @param {MouseEvent} e 事件参数
   * @returns {void}
   */
  function onClick(e: MouseEvent): void {
    if (selectionChanged) {
      e.preventDefault();
      e.stopPropagation();
    }
    selectionChanged = false;
  }

  return {
    /**
     * 注册事件
     * @returns {void}
     */
    registerEvent(): void {
      if (registered || isServer) {
        return;
      }
      registered = true;
      document.addEventListener('click', onClick, CAPTURE_EVENT);
      document.addEventListener('mousedown', onMouseDown, CAPTURE_EVENT);
      document.addEventListener('gesturestart', onGestureStart, CAPTURE_EVENT);
      document.addEventListener('contextmenu', onContextMenuEvent, CAPTURE_EVENT);
      document.addEventListener('selectstart', onSelectionStart, CAPTURE_EVENT);
      document.addEventListener('selectionchange', onSelectionChange, CAPTURE_EVENT);
    },

    /**
     * 注销事件
     * @returns {void}
     */
    removeEvent(): void {
      if (!registered || isServer) {
        return;
      }
      registered = false;
      document.removeEventListener('click', onClick);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('gesturestart', onGestureStart);
      document.removeEventListener('contextmenu', onContextMenuEvent);
      document.removeEventListener('selectstart', onSelectionStart);
      document.removeEventListener('selectionchange', onSelectionChange);
    },

    /**
     * 禁用缩放
     * @returns {void}
     */
    disableZoom(): void {
      gestureForbidden = true;
    },

    /**
     * 允许缩放
     * @returns {void}
     */
    enableZoom(): void {
      gestureForbidden = false;
    },

    /**
     * 禁用页面选中
     * @returns {void}
     */
    disableSelection(): void {
      selectionForbidden = true;
      contextmenuForbidden = true;
    },

    /**
     * 允许页面选中
     * @returns {void}
     */
    enableSelection(): void {
      selectionForbidden = false;
      contextmenuForbidden = false;
    },

    /**
     * 初始化
     * @returns {void}
     */
    init(): void {
      this.registerEvent();
    },
  };
})();

export default ViewportControl;
