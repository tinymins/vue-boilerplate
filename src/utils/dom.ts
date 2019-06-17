/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

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

const getParentNodes = ($el: HTMLElement): HTMLElement[] => {
  const $els: HTMLElement[] = [];
  while ($el) {
    $els.push($el);
    $el = $el.parentNode as HTMLElement;
  }
  return $els;
};

export interface ElementRect {
  x: number;
  y: number;
  w: number;
  h: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

export const getElementRect = ($target, $base: HTMLElement = document.documentElement): ElementRect => {
  const rect = $target.getBoundingClientRect();
  if (!$base || $base === document.documentElement) {
    return rect;
  }
  let offsetX = 0;
  let offsetY = 0;
  // 计算它们最近的共同父节点
  const $baseParentNodes = getParentNodes($base);
  const $targetParentNodes = getParentNodes($target);
  const $rootNode = $baseParentNodes.find($el => $targetParentNodes.includes($el));
  // 忽略DOM顶层元素html和body的滚动 因为$base的rect信息里会计算它们的数值到top(y)字段中导致重复计算
  const $baseParentDOMs = $baseParentNodes.filter($p => $p !== document.documentElement && $p !== document.body);
  const $targetParentDOMs = $targetParentNodes.filter($p => $p !== document.documentElement && $p !== document.body);
  const $rootDOM = $rootNode !== document.documentElement && $rootNode !== document.body ? $rootNode : null;
  // 计算参照节点相对父节点的偏移
  const baseIndex = $baseParentDOMs.findIndex($el => $el === $rootNode);
  const baseLength = baseIndex === -1 ? $baseParentDOMs.length : baseIndex + 1;
  for (let i = 0; i < baseLength; i += 1) {
    const $el = $baseParentDOMs[i];
    offsetX -= $el.scrollLeft || 0;
    offsetY -= $el.scrollTop || 0;
  }
  // 计算目标节点相对父节点的偏移
  const targetIndex = $targetParentDOMs.findIndex($el => $el === $rootNode);
  const targetLength = targetIndex === -1 ? $targetParentDOMs.length : targetIndex + 1;
  for (let i = 0; i < targetLength; i += 1) {
    const $el = $targetParentDOMs[i];
    offsetX += $el.scrollLeft || 0;
    offsetY += $el.scrollTop || 0;
  }
  // 计算父节点自身的滚动造成的偏移
  if ($rootDOM) {
    offsetX += $rootDOM.scrollLeft || 0;
    offsetY += $rootDOM.scrollTop || 0;
  }
  const rectBase = $base.getBoundingClientRect();
  const x = rect.left - rectBase.left + offsetX;
  const y = rect.top - rectBase.top + offsetY;
  const w = rect.width;
  const h = rect.height;
  return { x, y, w, h, top: y, left: x, width: w, height: h };
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
