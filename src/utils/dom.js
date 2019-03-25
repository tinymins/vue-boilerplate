/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["off"] */

export const getScrollTop = ($scroller) => {
  if ($scroller === window) {
    return window.scrollY;
  }
  return $scroller.scrollTop;
};

export const setScrollTop = ($scroller, top) => {
  if ($scroller === window) {
    window.scrollTo(window.scrollX, top);
  } else {
    $scroller.scrollTop = top;
  }
};

export const getScrollHeight = ($scroller) => {
  if ($scroller === window) {
    return document.body.scrollHeight - window.innerHeight;
  }
  return $scroller.scrollHeight - $scroller.clientHeight;
};

export const getScrollInfo = ($scroller) => {
  const info = {};
  if ($scroller === window) {
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
export const getScrollRemain = $scroller => getScrollInfo($scroller).scrollRemain;

const getParentNodes = ($el) => {
  const $els = [];
  while ($el) {
    $els.push($el);
    $el = $el.parentNode;
  }
  return $els;
};

export const getElementRect = ($target, $base = document.documentElement) => {
  const rect = $target.getBoundingClientRect();
  if (!$base || $base === window) {
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
