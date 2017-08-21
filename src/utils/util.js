/*
* @Author: William Chan
* @Date:   2017-05-03 15:08:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:40:28
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

// import moment from 'moment';

// export const isDevelop = () => process.env.NODE_ENV !== 'production';
export const isDevelop = () => true;

export const setWechatTitle = (title) => {
  document.title = title;
  const mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.setAttribute('src', '/favicon.ico');
    const iframeCallback = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);
  }
};

export const isMobileDevice = () => /mobile/i.test(navigator.userAgent);

const fillRouter = (router, settings) => {
  router.forEach((item) => {
    const setting = settings.find(r => r.name === r.name);
    if (!setting) {
      return;
    }
    Object.keys(setting).forEach((k) => {
      if (k === 'name' || k === 'children') {
        return;
      }
      item[k] = setting[k];
    });
    if (item.children && setting.children) {
      item.children = fillRouter(item.children, setting.children);
    }
  });
  return router;
};
export const dynamicRouter = (router, routeM, routePC) => {
  const route = isMobileDevice() ? routeM : routePC;
  return fillRouter(router, route);
};
