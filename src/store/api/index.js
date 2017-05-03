/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:20:20
*/

import axios from 'axios';
import { MessageBox, Indicator } from 'mint-ui';
import { isDevelop } from '@/utils/util';

export const API_HOST = isDevelop() ? 'https://dev.haimanchajian.com/api' : '/api';

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
  } else if (error.response.status > 500) {
    MessageBox(`服务器错误 ${error.response.status}`, error.stack);
  } else if (error.response.status > 400) {
    MessageBox(`请求失败 ${error.data.errcode}`, error.data.errmsg);
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
