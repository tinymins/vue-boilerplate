/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */

type EasingFunction = (t: number) => number;

const easeIn = (p: number): EasingFunction => (t: number): number => t ** p;
const easeOut = (p: number): EasingFunction => (t: number): number => 1 - Math.abs((t - 1) ** p);
const easeInOut = (p: number): EasingFunction => (t: number): number => (t < 0.5 ? easeIn(p)(t * 2) / 2 : easeOut(p)(t * 2 - 1) / 2 + 0.5);

// no easing, no acceleration
export const linear: EasingFunction = easeInOut(1);
// accelerating from zero velocity
export const easeInQuad: EasingFunction = easeIn(2);
// decelerating to zero velocity
export const easeOutQuad: EasingFunction = easeOut(2);
// acceleration until halfway, then deceleration
export const easeInOutQuad: EasingFunction = easeInOut(2);
// accelerating from zero velocity
export const easeInCubic: EasingFunction = easeIn(3);
// decelerating to zero velocity
export const easeOutCubic: EasingFunction = easeOut(3);
// acceleration until halfway, then deceleration
export const easeInOutCubic: EasingFunction = easeInOut(3);
// accelerating from zero velocity
export const easeInQuart: EasingFunction = easeIn(4);
// decelerating to zero velocity
export const easeOutQuart: EasingFunction = easeOut(4);
// acceleration until halfway, then deceleration
export const easeInOutQuart: EasingFunction = easeInOut(4);
// accelerating from zero velocity
export const easeInQuint: EasingFunction = easeIn(5);
// decelerating to zero velocity
export const easeOutQuint: EasingFunction = easeOut(5);
// acceleration until halfway, then deceleration
export const easeInOutQuint: EasingFunction = easeInOut(5);
// elastic bounce effect at the beginning
export const easeInElastic: EasingFunction = (t: number): number => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
// elastic bounce effect at the end
export const easeOutElastic: EasingFunction = (t: number): number => {
  const n = t - 1;
  return (0.04 * t * Math.sin(25 * n)) / n;
};
// elastic bounce effect at the beginning and end
export const easeInOutElastic: EasingFunction = (t: number): number => {
  t -= 0.5;
  return t < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
};
export const easeInSin: EasingFunction = (t: number): number => 1 + Math.sin((Math.PI / 2) * t - Math.PI / 2);
export const easeOutSin: EasingFunction = (t: number): number => Math.sin((Math.PI / 2) * t);
export const easeInOutSin: EasingFunction = (t: number): number => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const easings = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
};
export const easing = (id: string, t: number): number => (easings[id] ? easings[id](t) : t);
