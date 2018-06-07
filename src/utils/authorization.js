/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-11-02 17:24:25
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 15:54:42
 */
import router from '@/router';
import store from '@/store';
import { WECHAT_LOGIN_URL } from '@/config';
import { BASE_ROUTE } from '@/config/environment';
import { concatPath } from '@/utils/util';

export const clearAuthorization = (requiresAuth) => {
  store.dispatch('user/USER_CLEAR', requiresAuth);
};

export const getAuthorization = async () => {
  const promise = store.dispatch('user/USER_GET', {
    strict: false,
  });
  if (promise) {
    await promise;
  }
  return store.state.user.status;
};

export const navgateRegisterRoute = () => {
  router.push({ name: 'user_register' });
};

const appRoot = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}${BASE_ROUTE}`;
export const getWechatLoginURL = route => (route ? `${WECHAT_LOGIN_URL}${encodeURIComponent(concatPath(appRoot, route.fullPath))}` : WECHAT_LOGIN_URL);
