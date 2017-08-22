/*
* @Author: William Chan
* @Date:   2017-05-03 15:08:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:40:28
*/

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

export const isInWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua));
};

export const isMobileDevice = () => /mobile/i.test(navigator.userAgent);
