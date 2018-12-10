/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
/* eslint-disable no-plusplus */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-properties */

const easeIn = p => t => Math.pow(t, p);
const easeOut = p => t => (1 - Math.abs(Math.pow(t - 1, p)));
const easeInOut = p => t => (t < 0.5 ? easeIn(p)(t * 2) / 2 : easeOut(p)(t * 2 - 1) / 2 + 0.5);

// no easing, no acceleration
export const linear = easeInOut(1);
// accelerating from zero velocity
export const easeInQuad = easeIn(2);
// decelerating to zero velocity
export const easeOutQuad = easeOut(2);
// acceleration until halfway, then deceleration
export const easeInOutQuad = easeInOut(2);
// accelerating from zero velocity
export const easeInCubic = easeIn(3);
// decelerating to zero velocity
export const easeOutCubic = easeOut(3);
// acceleration until halfway, then deceleration
export const easeInOutCubic = easeInOut(3);
// accelerating from zero velocity
export const easeInQuart = easeIn(4);
// decelerating to zero velocity
export const easeOutQuart = easeOut(4);
// acceleration until halfway, then deceleration
export const easeInOutQuart = easeInOut(4);
// accelerating from zero velocity
export const easeInQuint = easeIn(5);
// decelerating to zero velocity
export const easeOutQuint = easeOut(5);
// acceleration until halfway, then deceleration
export const easeInOutQuint = easeInOut(5);
// elastic bounce effect at the beginning
export const easeInElastic = t => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
// elastic bounce effect at the end
export const easeOutElastic = t => 0.04 * t / (--t) * Math.sin(25 * t);
// elastic bounce effect at the beginning and end
export const easeInOutElastic = t => ((t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1);
export const easeInSin = t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
export const easeOutSin = t => Math.sin(Math.PI / 2 * t);
export const easeInOutSin = t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
