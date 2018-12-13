/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */
import router from '@/router';
import store from '@/store';
import { WECHAT_AUTH_URL, AUTH_REDIRECT } from '@/config';
import { BASE_ROUTE } from '@/config/environment';
import { concatPath } from '@/utils/util';

export const getAuthorization = async (reload) => {
  await store.dispatch('user/USER_GET', {
    reload,
    strict: false,
  });
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

export const checkAuthorizeRedirect = async (route, status) => {
  let redirect;
  const auths = Array.prototype.concat.apply([],
    route.matched.map(record => record.meta.auth).filter(_ => _).reverse());
  if (auths.length) {
    if (!status) {
      status = await getAuthorization();
    }
    if (!auths.includes(status)) {
      redirect = AUTH_REDIRECT[status];
    }
  }
  if (typeof redirect === 'string' && !/^(https:|http:)/.test(redirect)) {
    if (/^\//.test(redirect)) {
      redirect = { path: redirect };
    } else {
      redirect = { name: redirect };
    }
  }
  if (typeof redirect === 'object') {
    if (!redirect.query) {
      redirect.query = {};
    }
    redirect.query.redirect = route.fullPath;
  }
  return redirect;
};
