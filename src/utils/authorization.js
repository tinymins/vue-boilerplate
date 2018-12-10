/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import router from '@/router';
import store from '@/store';
import { WECHAT_AUTH_URL } from '@/config';
import { BASE_ROUTE } from '@/config/environment';
import { concatPath } from '@/utils/util';

export const clearAuthorization = (requiresAuth) => {
  store.dispatch('user/USER_CLEAR', { isLogout: true, requiresAuth });
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
export const getAuthorizeURL = (service, reason, route) => WECHAT_AUTH_URL
  .replace('{{reason}}', reason)
  .replace('{{service}}', service)
  .replace('{{redirect}}', route ? encodeURIComponent(concatPath(appRoot, route.fullPath)) : '');
