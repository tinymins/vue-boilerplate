/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import get from 'lodash/get';
import { UAParser } from 'ua-parser-js';
import { RouterMode } from 'vue-router';
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
export const isLocalhost = (): boolean => (/^(?:\d+.\d+.\d+.\d+|localhost)$/u).test(window.location.hostname);

export const isInSafari = (): boolean => browser.name === 'Safari' || browser.name === 'Mobile Safari';
export const isInEmbedded = (): boolean => (/(?:weibo|qq|micromessenger)/u).test(ua);
export const isInApp = (): boolean => false;
export const isInWechat = (): boolean => (/micromessenger/u).test(ua);
export const isInWechatMobile = (): boolean => isInWechat() && !(/windowswechat/u).test(ua);
export const isInWechatDesktop = (): boolean => isInWechat() && (/windowswechat/u).test(ua);

export const isInWebAppiOS = (): boolean => !!get(window.navigator, 'standalone');
export const isInWebAppChrome = (): boolean => !!window.matchMedia('(display-mode: standalone)').matches;
export const isInMobileDevice = (): boolean => (/mobile/iu).test(ua);
export const isIniOS = (): boolean => (/iphone/iu).test(ua);
export const isInAppleWebkit = (): boolean => (/applewebkit\/([\d.]+)/iu).test(ua);
export const getAppleWebkitVersion = (): string => ((/applewebkit\/([\d.]+)/iu).exec(ua) || [])[1] || '0';

export type ColorTheme = 'user' | 'system' | 'auto';
/**
 * Get color scheme for the website.
 * If browser supports "prefers-color-scheme" it will respect the setting for light or dark mode
 * otherwise it will set a dark theme during night time
 * @param {ColorTheme[]} order 获取方式优先顺序
 * @returns {string} Theme name
 */
export const getColorTheme = (order: ColorTheme[] = ['user', 'auto', 'system']): string => {
  const colorTheme: Record<string, string> = {};
  const theme = storage.getLocal<string>('color-theme') || 'light';
  if (theme) {
    colorTheme.user = theme;
  }
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) {
    colorTheme.system = 'dark';
  }
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (isLightMode) {
    colorTheme.system = 'light';
  }
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
  if (isNotSpecified || hasNoSupport) {
    const now = new Date();
    const hour = now.getHours();
    colorTheme.auto = hour < 6 || hour >= 22 ? 'dark' : 'light';
  }
  return order.map(mode => colorTheme[mode]).filter(_ => _)[0] || 'light';
  // window.matchMedia('(prefers-color-scheme: dark)').addListener(e => e.matches && activateDarkMode())
  // window.matchMedia('(prefers-color-scheme: light)').addListener(e => e.matches && activateLightMode())
};

export const setColorTheme = (theme: string): void => {
  if (theme) {
    storage.setLocal('color-theme', theme);
  } else {
    storage.removeLocal('color-theme');
  }
};

export const isInBrowser = (): boolean => typeof window !== 'undefined';
export const isSupportPushState = (): boolean => {
  if (!isInBrowser()) {
    return false;
  }
  if (
    (ua.indexOf('android 2.') !== -1 || ua.indexOf('android 4.0') !== -1)
    && ua.indexOf('mobile safari') !== -1
    && ua.indexOf('chrome') === -1
    && ua.indexOf('windows phone') === -1
  ) {
    return false;
  }
  return window.history && 'pushState' in window.history;
};

export const getRouterMode = (): RouterMode => {
  if (process.env.ROUTER_MODE === 'hash' || process.env.ROUTER_MODE === 'history' || process.env.ROUTER_MODE === 'abstract') {
    return process.env.ROUTER_MODE;
  }
  return isInWechatMobile() || !isSupportPushState() ? 'hash' : 'history';
};
