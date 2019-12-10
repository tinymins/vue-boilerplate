/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { wechat } from 'vue-wechat/1.4.0';
import { ICON_URL } from '@/config';
import store from '@/store';
import { COMMON } from '@/store/types';
import { showDialog } from '@/store/utils';
import { concatPath, safeCall } from '@/utils/util';
import { routeClone, routeEquals, RouteInfo } from '@/utils/navigation';
import { isInWechatMobile, isLocalhost, isInDevMode, isInWechat } from './environment';

export const onWechatSDKFail = (...args): void => {
  if (!isInDevMode('manually')) {
    return;
  }
  console.error(...args);
};

export interface ShareData {
  title?: string;
  desc?: string;
  link?: string;
  route?: RouteInfo;
  imgUrl?: string;
  overwrite?: boolean;
  success?: () => void;
  cancel?: () => void;
}

let shareData, shareReady;
const applyPageShare = (data): void => {
  if (shareReady && data) {
    const { title, desc, link, imgUrl, success, cancel } = data;
    wechat.onMenuShareTimeline({ title: `${title} ${desc}`, link, imgUrl, success, cancel, fail: onWechatSDKFail });
    wechat.onMenuShareAppMessage({ title, desc, link, imgUrl, type: 'link', dataUrl: '', success, cancel, fail: onWechatSDKFail });
    wechat.onMenuShareQQ({ title, desc, link, imgUrl, success, cancel, fail: onWechatSDKFail });
    wechat.onMenuShareWeibo({ title, desc, link, imgUrl, success, cancel, fail: onWechatSDKFail });
    wechat.onMenuShareQZone({ title, desc, link, imgUrl, success, cancel, fail: onWechatSDKFail });
  }
  shareData = shareReady ? void 0 : data;
};
const onWechatReady = (): void => {
  // console.log('wx.ready'); // eslint-disable-line no-console
  shareReady = true;
  applyPageShare(shareData);
};
wechat.ready(onWechatReady);

/**
 * 设置页面分享信息
 * @param {object} config 分享信息配置表
 * @returns {void}
 */
export const setPageShare = ({
  title = document.title,
  desc = '',
  link = '',
  route = store.state.common.route.current || store.state.common.route.to,
  imgUrl = ICON_URL,
  overwrite = true,
  success = () => {},
  cancel = () => {},
}: ShareData = {
  overwrite: false,
}): void => {
  if (!route) {
    return;
  }
  if (!overwrite && shareData && routeEquals(route, shareData.route)) {
    return;
  }
  if (!link) {
    link = concatPath(window.location.origin, process.env.PUBLIC_PATH, route.fullPath);
  }
  const user = store.getters['user/user'];
  if (user) {
    link += link.indexOf('?') > 0 ? '&' : '?';
    link += `__from_uid=${user.id.toString(16)}`;
  }
  applyPageShare({ title, desc, link, imgUrl, route: routeClone(route), success, cancel });
};

export const setPageTitle = (title: string): void => {
  if (!title) {
    title = '\u200e';
  }
  document.title = title;
  // 在微信iOS webview更新到WKWebView之前我们可以通过加载一个iframe来实现单页面应用title更改。但是17年初更新到WKWebView后该方法也失效，
  // 据对开发者十分特别不友好的把所有文档放在同一个页面不能通过url区分甚至连锚点也懒得做的的微信开发文档说，3月份会修复。
  // const mobile = navigator.userAgent.toLowerCase();
  // if (/iphone|ipad|ipod/.test(mobile)) {
  //   const iframe = document.createElement('iframe');
  //   iframe.style.visibility = 'hidden';
  //   iframe.setAttribute('src', '/favicon.ico');
  //   const iframeCallback = () => {
  //     setTimeout(() => {
  //       iframe.removeEventListener('load', iframeCallback);
  //       document.body.removeChild(iframe);
  //     }, 0);
  //   };
  //   iframe.addEventListener('load', iframeCallback);
  //   document.body.appendChild(iframe);
  // }
};

/**
 * 初始化微信SDK
 * @returns {Promise} Promise
 */
export const initWechatSDK = (() => {
  let inited = false;
  return (): void => {
    if (!inited) {
      // bind wechat sdk error function.
      wechat.error((e) => {
        showDialog({
          title: 'Wechat SDK error',
          content: e.errMsg,
        });
        if (e.errMsg === 'config:invalid signature') {
          if (!isInDevMode()) {
            window.location.reload();
          }
          console.error(e);
        }
      });
      inited = true;
    }
  };
})();

/**
 * 根据当前 URL 配置微信 SDK 参数
 * @returns {Promise} Promise
 */
export const configWechatSDK = (() => {
  if (!isInWechat()) {
    return () => Promise.resolve();
  }
  let currentLocation = '';
  let currentReady = false;
  let readyResolves: Function[] = [];
  let readyRejects: Function[] = [];
  const clearReadyPromise = (): void => {
    readyResolves = [];
    readyRejects = [];
  };
  const onResolve = (): void => {
    readyResolves.forEach(cb => safeCall(cb));
    clearReadyPromise();
  };
  const onReject = (err): void => {
    readyRejects.forEach(cb => safeCall(cb, err));
    clearReadyPromise();
  };
  return (): Promise<void> => {
    const location = window.location.href.replace(/#.*$/u, '');
    if (!isLocalhost()) {
      if (location !== currentLocation) {
        // start initing wechat sdk.
        initWechatSDK();
        currentLocation = location;
        currentReady = false;
        clearReadyPromise();
        store.dispatch(`common/${COMMON.GET_WECHAT_SDK_INFO}`, { url: location }).then((info) => {
          if (location === currentLocation) {
            wechat.config({
              debug: info.debug,
              appId: info.appId,
              timestamp: info.timestamp,
              nonceStr: info.nonceStr,
              signature: info.signature,
              jsApiList: info.jsApiList,
              fail: onWechatSDKFail,
            });
            currentReady = true;
            // console.log('wx.config', info); // eslint-disable-line no-console
            onResolve();
          }
        }).catch(onReject);
      }
      // return promise if not ready
      if (!currentReady) {
        return new Promise((resolve, reject) => {
          readyResolves.push(resolve);
          readyRejects.push(reject);
        });
      }
    }
    return Promise.resolve();
  };
})();

export const checkWepayReqirement = (): boolean => {
  if (isInWechatMobile()) {
    const currentPath = window.location.pathname.replace(/(^\/+|\/+$)/uig, '');
    const expectPath = (process.env.PUBLIC_PATH || '').replace(/(^\/+|\/+$)/uig, '');
    if (currentPath !== expectPath) {
      window.location.replace(`${process.env.PUBLIC_PATH}?_=${new Date().valueOf()}${window.location.hash}`);
      return false;
    }
  }
  return true;
};
