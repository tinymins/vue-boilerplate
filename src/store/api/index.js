/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import qs from 'qs';
import axios from 'axios';
import { isDevelop, isMobileDevice } from '@/utils/util';

export const API_HOST = isDevelop() ? 'https://dev.haimanchajian.com/api' : '/api';

// Dynamic load different indicator and messagebox due to device type
let Indicator = () => { console.warn('Indicator has not been loaded yet!'); };
let MessageBox = () => { console.warn('MessageBox has not been loaded yet!'); };
const getLoadingText = config => `Connecting ${config.url.replace(/.*:\/\//, '').replace(/\/.*/, '')}${config.loadingText ? ` | ${config.loadingText}` : ''}`;
if (isMobileDevice()) {
  import('mint-ui/lib/indicator').then(({ default: OBJ }) => {
    let stack = [];
    Indicator = {
      open: (id, text) => {
        stack.push({ id, text });
        if (this.indicator) {
          this.indicator.text = stack.map(c => c.text).filter(_ => _).join(' | ');
          return;
        }
        this.indicator = OBJ.open(text);
      },
      close: (id) => {
        if (id) {
          stack = stack.filter(c => c.id !== id);
        } else {
          stack.pop();
        }
        if (stack.length !== 0) {
          return;
        }
        OBJ.close();
      },
    };
  });
  import('mint-ui/lib/indicator/style.css');

  import('mint-ui/lib/message-box').then((module) => {
    MessageBox = module.default;
  });
  import('mint-ui/lib/message-box/style.css');
} else {
  import('element-ui/lib/loading').then(({ default: OBJ }) => {
    let stack = [];
    Indicator = {
      open: (id, text) => {
        stack.push({ id, text });
        if (this.indicator) {
          this.indicator.text = stack.map(c => c.text).filter(_ => _).join(' | ');
          return;
        }
        this.indicator = OBJ.service({ fullscreen: true, text });
      },
      close: (id) => {
        if (id) {
          stack = stack.filter(c => c.id !== id);
        } else {
          stack.pop();
        }
        if (!this.indicator || stack.length !== 0) {
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
  Indicator.open(req, getLoadingText(req));
  return req;
};

export const onRequestError = error => Promise.reject(error);

export const onResponse = (res) => {
  Indicator.close(res.config);
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  Indicator.close(error.config);
  if (!error.response) {
    MessageBox(error.message, error.stack);
  } else if (error.response.status === 401) {
      // clearAuthorization();
  } else if (error.response.status >= 500) {
    MessageBox(`Server error: ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    MessageBox(`Request failed: ${error.response.status}`, error.response.data.errmsg || 'no errmsg');
  } else {
    MessageBox(`Exception: ${error.response.status}`, 'Unknown response error');
  }
  return Promise.reject(error);
};

export const openIndicator = (...params) => { Indicator.open(...params); };
export const closeIndicator = (...params) => { Indicator.close(...params); };

export const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  timeout: !isDevelop() && 10000,
});

http.postForm = (url, data, ...params) => http.post(url, qs.stringify(data), ...params);
http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
