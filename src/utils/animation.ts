/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import get from 'lodash/get';

const requestAnimationFrame = get(window, 'requestAnimationFrame')
  || get(window, 'webkitRequestAnimationFrame')
  || get(window, 'mozRequestAnimationFrame')
  || get(window, 'msRequestAnimationFrame')
  || ((callback: () => void) => window.setTimeout(callback, 1000 / 60));

const stepAnimateVal = (from: number, to: number, step: number, apply: (per: number) => void, resolve: () => void): void => {
  if (from === to) {
    resolve();
    return;
  }
  const current = (to - (from + step)) * step < 0 ? to : from + step;
  apply(current);
  requestAnimationFrame(() => stepAnimateVal(current, to, step, apply, resolve));
};

export const animateVal = (from: number, to: number, duration: number, apply: (per: number) => void): Promise<void> => {
  if (from !== to) {
    const step = Math.ceil(((to - from) / duration) * 60);
    return new Promise((resolve) => {
      stepAnimateVal(from, to, step, apply, resolve);
    });
  }
  return Promise.resolve();
};

interface AnimateVal {
  current: number;
  from: number;
  to: number;
  step: number;
}

type AnimateValsApply = (per: AnimateVal[]) => void;
type AnimateValsResolve = () => void;

const stepAnimateVals = (vals: AnimateVal[], apply: AnimateValsApply, resolve: AnimateValsResolve): void => {
  if (!vals.some(p => p.current !== p.to)) {
    resolve();
    return;
  }

  vals.forEach((p) => {
    p.current = (p.to - (p.current + p.step)) * p.step < 0 ? p.to : p.current + p.step;
  });
  apply(vals);
  requestAnimationFrame(() => stepAnimateVals(vals, apply, resolve));
};

export const animateVals = (
  vals: AnimateVal[],
  duration: number,
  apply: (per: {
    current: number;
    to: number;
    step: number;
  }[]) => void,
): Promise<void> => {
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

const stepScroll = (
  el: HTMLElement | Window,
  startT: number,
  endT: number,
  stepT: number,
  startL: number,
  endL: number,
  stepL: number,
  resolve: () => void,
): void => {
  if (startT === endT && startL === endL) {
    resolve();
    return;
  }

  const dT = (endT - (startT + stepT)) * stepT < 0 ? endT : startT + stepT;
  const dL = (endL - (startL + stepL)) * stepL < 0 ? endL : startL + stepL;

  if (el instanceof Window) {
    const dTT = dT === void 0 ? window.scrollY : dT;
    const dTL = dL === void 0 ? window.scrollX : dL;
    window.scrollTo(dTL, dTT);
  } else {
    if (dT !== void 0) { el.scrollTop = dT; }
    if (dL !== void 0) { el.scrollLeft = dL; }
  }
  requestAnimationFrame(() => stepScroll(el, dT, endT, stepT, dL, endL, stepL, resolve));
};

export const animateScroll = ({
  el, duration = 500,
  fromLeft = el instanceof Window ? el.scrollX : el.scrollLeft, toLeft = fromLeft,
  fromTop = el instanceof Window ? el.scrollY : el.scrollTop, toTop = fromTop,
}: {
  el: HTMLElement | Window;
  duration?: number;
  fromLeft?: number;
  toLeft?: number;
  fromTop?: number;
  toTop?: number;
}): Promise<void> => {
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
