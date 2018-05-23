/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-06 13:45:04
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-23 11:27:05
 */
import * as storage from '@/utils/storage';

export const isDevelop = () => process.env.NODE_ENV !== 'production' || storage.getLocal('dev');
export const setDevelop = dev => (dev ? storage.setLocal('dev', dev) : storage.removeLocal('dev'));

export const isDevhost = () => /^dev\..*$/.test(window.location.hostname);
export const isLocalhost = () => /^(?:\d+.\d+.\d+.\d+|localhost)$/.test(window.location.hostname);

export const inInBrowser = typeof window !== 'undefined';
export const isInWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua));
};

export const isInEmbedded = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua) && !/windowswechat/.test(ua));
};

export const isInWebAppiOS = () => window.navigator.standalone;
export const isInWebAppChrome = () => !!window.matchMedia('(display-mode: standalone)').matches;
export const isInMobileDevice = () => /mobile/i.test(navigator.userAgent);
export const isIniOS = () => /iphone/i.test(navigator.userAgent);
export const isInAppleWebkit = () => /AppleWebKit\/([\d.]+)/i.test(navigator.userAgent);
export const getAppleWebkitVersion = () => (/AppleWebKit\/([\d.]+)/i.exec(navigator.userAgent) || [])[1] || '0';
export const isDeviceiPhoneX = () => isIniOS() && window.screen.height === 812 && window.screen.width === 375;

export const supportsPushState = inInBrowser && (() => {
  const ua = window.navigator.userAgent;
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false;
  }
  return window.history && 'pushState' in window.history;
})();
