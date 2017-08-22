/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import axios from 'axios';
import { isDevelop, isMobileDevice } from '@/utils/util';

export const API_HOST = isDevelop() ? 'https://dev.haimanchajian.com/api' : '/api';

// DYnamic load different indicator and messagebox due to device type
let Indicator = () => { console.warn('Indicator has not been loaded yet!'); };
let MessageBox = () => { console.warn('MessageBox has not been loaded yet!'); };
if (isMobileDevice()) {
  import('mint-ui/lib/indicator').then((module) => {
    Indicator = module.default;
  });
  import('mint-ui/lib/indicator/style.css');

  import('mint-ui/lib/message-box').then((module) => {
    MessageBox = module.default;
  });
  import('mint-ui/lib/message-box/style.css');
} else {
  import('element-ui/lib/loading').then(({ default: Loading }) => {
    Indicator = {
      open: () => {
        if (this.indicator) {
          return;
        }
        this.indicator = Loading.service({ fullscreen: true });
      },
      close: () => {
        if (!this.indicator) {
          return;
        }
        this.indicator.close();
        this.indicator = null;
      },
    };
  });
  import('element-ui/lib/theme-default/loading.css');

  import('element-ui/lib/message-box').then(({ default: alert }) => {
    MessageBox = (title, content) => { alert(content, title); };
  });
  import('element-ui/lib/theme-default/message-box.css');
}

window.onerror = (msg) => {
// window.onerror = (msg, url, lineNo, columnNo, error) => {
  MessageBox('JavaScript catch', msg);
  return false;
};

export const onRequest = (req) => {
  if (req.interceptors !== false) {
    req.interceptors = true;
  }
  Indicator.open();
  return req;
};

export const onRequestError = error => Promise.reject(error);

export const onResponse = (res) => {
  Indicator.close();
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  Indicator.close();
  if (!error.response) {
    MessageBox(error.message, error.stack);
  } else if (error.response.status === 401) {
      // clearAuthorization();
  } else if (error.response.status >= 500) {
    MessageBox(`服务器错误 ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    MessageBox(`请求失败 ${error.response.status}`, error.response.data.errmsg || 'not errmsg');
  } else {
    MessageBox(`异常 ${error.response.status}`, '未知Response错误');
  }
  return Promise.reject(error);
};

export const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  timeout: !isDevelop() && 10000,
});

http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
