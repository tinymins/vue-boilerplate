/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export const getScrollTop = ($scroller: HTMLElement | Window): number => {
  if ($scroller instanceof Window) {
    return window.scrollY;
  }
  return $scroller.scrollTop;
};

export const setScrollTop = ($scroller: HTMLElement | Window, top: number): void => {
  if ($scroller instanceof Window) {
    window.scrollTo(window.scrollX, top);
  } else {
    $scroller.scrollTop = top;
  }
};

export const getScrollHeight = ($scroller: HTMLElement | Window): number => {
  if ($scroller instanceof Window) {
    return document.body.scrollHeight - window.innerHeight;
  }
  return $scroller.scrollHeight - $scroller.clientHeight;
};

export interface ScrollInfo {
  scrollTop: number;
  offsetHeight: number;
  scrollHeight: number;
  clientHeight: number;
  scrollRemain: number;
}

export const getScrollInfo = ($scroller: HTMLElement | Window): ScrollInfo => {
  const info: ScrollInfo = {
    scrollTop: NaN,
    offsetHeight: NaN,
    scrollHeight: NaN,
    clientHeight: NaN,
    scrollRemain: NaN,
  };
  if ($scroller instanceof Window) {
    info.scrollTop = window.scrollY;
    info.offsetHeight = document.body.offsetHeight;
    info.scrollHeight = document.body.scrollHeight;
    info.clientHeight = window.innerHeight;
  } else {
    info.scrollTop = $scroller.scrollTop;
    info.offsetHeight = $scroller.offsetHeight;
    info.scrollHeight = $scroller.scrollHeight;
    info.clientHeight = $scroller.clientHeight;
  }
  info.scrollRemain = Math.max(info.scrollHeight - info.clientHeight - info.scrollTop, 0);
  return info;
};
export const getScrollRemain = ($scroller: HTMLElement | Window): number => getScrollInfo($scroller).scrollRemain;

const getParentElements = (baseEl: HTMLElement): HTMLElement[] => {
  const els: HTMLElement[] = [baseEl];
  while (els.length) {
    const el = els[els.length - 1];
    if (!el || !el.parentElement) {
      break;
    }
    els.push(el.parentElement);
  }
  return els;
};

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * 计算一个 DOM 节点相对另一个节点的位置
 * @param {HTMLElement} el 从子节点前往根节点的节点列表
 * @param {HTMLElement} rootEl 中断节点
 * @returns {Rect} 相对位置
 */
const getElementPos = (el: HTMLElement, rootEl?: HTMLElement): { top: number; left: number } => {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  while (el !== rootEl && el.parentElement) {
    el = el.parentElement;
    const st = getComputedStyle(el);
    if (st.position === 'relative') {
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    top -= el.scrollTop;
    left -= el.scrollLeft;
  }
  return { top, left };
};

export const getElementRect = (targetEl: HTMLElement, baseEl: HTMLElement = document.documentElement): ElementRect => {
  // 计算它们最近的共同父节点、相对父节点的偏移
  const baseParentEls = getParentElements(baseEl);
  const targetParentEls = getParentElements(targetEl);
  const rootEl = baseParentEls.find($el => targetParentEls.includes($el));
  const basePos = getElementPos(baseEl, rootEl);
  const targetPos = getElementPos(targetEl, rootEl);
  // 计算通过 getBoundingClientRect 获得的结果
  const baseRect = baseEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const rectTop = (targetEl === document.documentElement ? 0 : targetRect.top)
    - (baseEl === document.documentElement ? 0 : baseRect.top);
  const rectLeft = (targetEl === document.documentElement ? 0 : targetRect.left)
    - (baseEl === document.documentElement ? 0 : baseRect.left);
  const domTop = targetPos.top - basePos.top;
  const domLeft = targetPos.left - basePos.left;
  // 当两者结果相近时取 getBoundingClientRect 的结果（精度更高） 否则取计算结果
  const top = Math.abs(domTop - rectTop) < 2 ? rectTop : domTop;
  const left = Math.abs(domLeft - rectLeft) < 2 ? rectLeft : domLeft;
  const width = targetRect.width;
  const height = targetRect.height;
  return { top, left, width, height };
};

/**
 * 让页面输入框失去焦点
 * @returns {void}
 */
export const blurInput = (): void => {
  const el = document.activeElement as HTMLElement;
  if (el) {
    el.blur();
  }
  window.document.body.focus();
};
