/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-06 13:45:04
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
import * as storage from '@/utils/storage';

const ua = navigator.userAgent.toLowerCase();
export const isDevelop = () => process.env.NODE_ENV !== 'production' || storage.getLocal('dev');
export const setDevelop = dev => (dev ? storage.setLocal('dev', dev) : storage.removeLocal('dev'));

export const isDevhost = () => /^dev\..*$/.test(window.location.hostname);
export const isLocalhost = () => /^(?:\d+.\d+.\d+.\d+|localhost)$/.test(window.location.hostname);

export const isInApp = () => false;
export const isInWechat = () => /micromessenger/.test(ua);
export const isInEmbedded = () => /micromessenger/.test(ua) && !/windowswechat/.test(ua);

export const isInWebAppiOS = () => window.navigator.standalone;
export const isInWebAppChrome = () => !!window.matchMedia('(display-mode: standalone)').matches;
export const isInMobileDevice = () => /mobile/i.test(ua);
export const isIniOS = () => /iphone/i.test(ua);
export const isInAppleWebkit = () => /applewebkit\/([\d.]+)/i.test(ua);
export const getAppleWebkitVersion = () => (/applewebkit\/([\d.]+)/i.exec(ua) || [])[1] || '0';
export const isDeviceiPhoneX = () => isIniOS() && window.screen.height === 812 && window.screen.width === 375;

const isInBrowser = typeof window !== 'undefined';
export const supportsPushState = isInBrowser && (() => {
  if (
    (ua.indexOf('android 2.') !== -1 || ua.indexOf('android 4.0') !== -1) &&
    ua.indexOf('mobile safari') !== -1 &&
    ua.indexOf('chrome') === -1 &&
    ua.indexOf('windows phone') === -1
  ) {
    return false;
  }
  return window.history && 'pushState' in window.history;
})();
