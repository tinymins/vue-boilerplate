/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import UAParser from 'ua-parser-js';
import * as storage from '@/utils/storage';

const ua = navigator.userAgent.toLowerCase();
const parser = new UAParser();
const browser = parser.getBrowser();

export const isDevelop = manually => (!manually && process.env.NODE_ENV !== 'production') || storage.getLocal('dev');
export const setDevelop = dev => (dev ? storage.setLocal('dev', dev) : storage.removeLocal('dev'));

export const isRun = () => process.env.NODE_ACTION === 'run';
export const isDevhost = () => (/^dev\..*$/u).test(window.location.hostname);
export const isProdhost = () => false;
export const isLocalhost = () => (/^(?:\d+.\d+.\d+.\d+|localhost)$/u).test(window.location.hostname);

export const isInSafari = () => browser.name === 'Safari' || browser.name === 'Mobile Safari';
export const isInApp = () => false;
export const isInWechat = () => (/micromessenger/u).test(ua);
export const isInWechatMobile = () => isInWechat() && !(/windowswechat/u).test(ua);
export const isInWechatDesktop = () => isInWechat() && (/windowswechat/u).test(ua);

export const isInWebAppiOS = () => window.navigator.standalone;
export const isInWebAppChrome = () => !!window.matchMedia('(display-mode: standalone)').matches;
export const isInMobileDevice = () => (/mobile/iu).test(ua);
export const isIniOS = () => (/iphone/iu).test(ua);
export const isInAppleWebkit = () => (/applewebkit\/([\d.]+)/iu).test(ua);
export const getAppleWebkitVersion = () => ((/applewebkit\/([\d.]+)/iu).exec(ua) || [])[1] || '0';

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

export const setProdDatabase = (prod) => {
  storage.removeLocal('database');
  if (prod) storage.setLocal('database', 'prod');
};
export const isProdDatabase = () => isProdhost() || storage.getLocal('database') === 'prod';
