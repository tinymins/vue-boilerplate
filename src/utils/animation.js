/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

const requestAnimationFrame = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || (callback => window.setTimeout(callback, 1000 / 60));

const stepAnimateVal = (from, to, step, apply, resolve) => {
  if (from === to) {
    resolve();
    return;
  }
  const current = (to - (from + step)) * step < 0 ? to : from + step;
  apply(current);
  requestAnimationFrame(() => stepAnimateVal(current, to, step, apply, resolve));
};

export const animateVal = (from, to, duration, apply) => {
  if (from !== to) {
    const step = Math.ceil(((to - from) / duration) * 60);
    return new Promise((resolve) => {
      stepAnimateVal(from, to, step, apply, resolve);
    });
  }
  return Promise.resolve();
};

const stepAnimateVals = (vals, apply, resolve) => {
  if (!vals.some(p => p.current !== p.to)) {
    resolve();
    return;
  }

  vals.forEach((p) => {
    p.current = (p.to - (p.current + p.step)) * p.step < 0 ? p.to : p.current + p.step;
  });
  apply(vals);
  requestAnimationFrame(() => stepAnimateVals(vals, apply));
};

export const animateVals = (vals, duration, apply) => {
  if (vals.some(p => p.from !== p.to)) {
    vals.forEach((p) => {
      p.current = p.from;
      p.step = Math.ceil(((p.to - p.from) / duration) * 60);
    });
    return new Promise((resolve) => {
      stepAnimateVals(vals, apply, resolve);
    });
  }
  return Promise.resolve();
};

const stepScroll = (el, startT, endT, stepT, startL, endL, stepL, resolve) => {
  if (startT === endT && startL === endL) {
    resolve();
    return;
  }

  const dT = (endT - (startT + stepT)) * stepT < 0 ? endT : startT + stepT;
  const dL = (endL - (startL + stepL)) * stepL < 0 ? endL : startL + stepL;

  if (el === window) {
    const dTT = dT === void 0 ? window.scrollY : dT;
    const dTL = dL === void 0 ? window.scrollX : dL;
    window.scrollTo(dTL, dTT);
  } else {
    if (dT !== void 0) el.scrollTop = dT;
    if (dL !== void 0) el.scrollLeft = dL;
  }
  requestAnimationFrame(() => stepScroll(el, dT, endT, stepT, dL, endL, stepL, resolve));
};

export const animateScroll = ({
  el, duration = 500,
  fromLeft = el === window ? el.scrollX : el.scrollLeft, toLeft = fromLeft,
  fromTop = el === window ? el.scrollY : el.scrollTop, toTop = fromTop,
}) => {
  if (fromLeft !== toLeft || fromTop !== toTop) {
    return new Promise((resolve) => {
      const stepLeft = duration > 0
        ? ((toLeft - fromLeft) / duration) * 50
        : toLeft - fromLeft;
      const stepTop = duration > 0
        ? ((toTop - fromTop) / duration) * 50
        : toTop - fromTop;
      stepScroll(
        el,
        fromTop, toTop, stepTop > 0 ? Math.ceil(stepTop) : Math.floor(stepTop),
        fromLeft, toLeft, stepLeft > 0 ? Math.ceil(stepLeft) : Math.floor(stepLeft),
        resolve,
      );
    });
  }
  return Promise.resolve();
};

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const easings = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t * t,
  // decelerating to zero velocity
  easeOutQuad: t => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + ((4 - (2 * t)) * t)),
  // accelerating from zero velocity
  easeInCubic: t => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: t => ((t - 1) * (t - 1) * (t - 1)) + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1),
  // accelerating from zero velocity
  easeInQuart: t => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: t => 1 - ((t - 1) * (t - 1) * (t - 1) * (t - 1)),
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - (8 * (t - 1) * (t - 1) * (t - 1) * (t - 1))),
  // accelerating from zero velocity
  easeInQuint: t => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: t => 1 + ((t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1)),
  // acceleration until halfway, then deceleration
  easeInOutQuint: t => (t < 0.5 ? 16 * t * t * t * t * t : 1 + (16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1))),
};
export const easing = (id, t) => (easings[id] ? easings[id](t) : t);
