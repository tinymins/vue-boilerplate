/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
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
    return document.body.scrollHeight - document.body.clientHeight;
  }
  return $scroller.scrollHeight - $scroller.clientHeight;
};

export const getScrollInfo = ($scroller) => {
  const info = {};
  if ($scroller === window) {
    info.scrollTop = window.scrollY;
    info.offsetHeight = document.body.offsetHeight;
    info.scrollHeight = document.body.scrollHeight;
    info.clientHeight = document.body.clientHeight;
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

export const getElementRect = ($target, $base = document.documentElement) => {
  const rect = $target.getBoundingClientRect();
  if (!$base || $base === window) {
    return rect;
  }
  const rectBase = $base.getBoundingClientRect();
  return new DOMRect(rect.x - rectBase.x, rect.y - rectBase.y, rect.width, rect.height);
};
