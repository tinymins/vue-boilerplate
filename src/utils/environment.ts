/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { UAParser } from 'ua-parser-js';
import * as storage from './storage';

const ua = navigator.userAgent.toLowerCase();
const parser = new UAParser();
const browser = parser.getBrowser();

export const isInDevMode = (key = ''): boolean => {
  if (key) {
    return !!storage.getLocal(`dev-${key}`);
  }
  return process.env.NODE_ENV !== 'production';
};
export const setDevMode = (key: string, dev: boolean): void => (dev ? storage.setLocal(`dev-${key}`, dev) : storage.removeLocal(`dev-${key}`));

export const isRun = (): boolean => process.env.NODE_ACTION === 'run';
export const isDevhost = (): boolean => (/^dev\..*$/u).test(window.location.hostname);
export const isProdhost = (): boolean => false;
export const isLocalhost = (): boolean => (/^(?:\d+.\d+.\d+.\d+|localhost)$/u).test(window.location.hostname);

export const isInSafari = (): boolean => browser.name === 'Safari' || browser.name === 'Mobile Safari';
export const isInEmbedded = (): boolean => (/(?:weibo|qq|micromessenger)/u).test(ua);
export const isInApp = (): boolean => (/hmapp\//u).test(ua);
export const isInWechat = (): boolean => (/micromessenger/u).test(ua);
export const isInWechatMobile = (): boolean => isInWechat() && !(/windowswechat/u).test(ua);
export const isInWechatDesktop = (): boolean => isInWechat() && (/windowswechat/u).test(ua);

export const isInWebAppiOS = (): boolean => {
  const navigator: any = window.navigator;
  return !!navigator.standalone;
};
export const isInWebAppChrome = (): boolean => !!window.matchMedia('(display-mode: standalone)').matches;
export const isInMobileDevice = (): boolean => (/mobile/iu).test(ua);
export const isIniOS = (): boolean => (/iphone/iu).test(ua);
export const isInAppleWebkit = (): boolean => (/applewebkit\/([\d.]+)/iu).test(ua);
export const getAppleWebkitVersion = (): string => ((/applewebkit\/([\d.]+)/iu).exec(ua) || [])[1] || '0';

const isInBrowser = typeof window !== 'undefined';
export const supportsPushState = isInBrowser && (() => {
  if (
    (ua.indexOf('android 2.') !== -1 || ua.indexOf('android 4.0') !== -1)
    && ua.indexOf('mobile safari') !== -1
    && ua.indexOf('chrome') === -1
    && ua.indexOf('windows phone') === -1
  ) {
    return false;
  }
  return window.history && 'pushState' in window.history;
})();

export const setProdDatabase = (prod): void => {
  storage.removeLocal('database');
  if (prod) storage.setLocal('database', 'prod');
};
export const isProdDatabase = (): boolean => isProdhost() || storage.getLocal('database') === 'prod';
