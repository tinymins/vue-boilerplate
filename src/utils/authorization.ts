/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { RouterInstance } from '@/router';
import { StoreInstance } from '@/store';
import { USER } from '@/store/types';
import { WECHAT_AUTH_URL, AUTH_REDIRECT, AUTH_STATE_LIST, PUBLIC_PATH } from '@/config';
import { concatPath } from '@/utils/util';
import { RouteInfo } from './navigation';

export const getAuthorization = async (store: StoreInstance, mode = ''): Promise<number> => {
  if (mode !== 'local') {
    await store.dispatch(`user/${USER.GET}`, {
      strict: false,
      action: mode,
    });
  }
  return store.state.user.status;
};

export const navgateRegisterRoute = (router: RouterInstance): void => {
  router.push({ name: 'user_register' });
};

const appRoot = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}${PUBLIC_PATH}`;
export const getAuthorizeURL = (service, reason, route): string => WECHAT_AUTH_URL
  .replace('{{reason}}', reason)
  .replace('{{service}}', service)
  .replace('{{redirect}}', route ? encodeURIComponent(concatPath(appRoot, route.fullPath)) : '');

export const checkAuthorizeRedirect = async (
  store: StoreInstance,
  route,
): Promise<Partial<RouteInfo> | string | undefined> => {
  let redirect: Partial<RouteInfo> | string | undefined;
  const auths: number[] = route.matched.flatMap(record => record.meta.auth)
    .filter(c => AUTH_STATE_LIST.includes(c)).reverse();
  if (auths.length > 0) {
    const status = await getAuthorization(store);
    if (!auths.includes(status)) {
      redirect = AUTH_REDIRECT[status];
    }
  }
  if (typeof redirect === 'string' && !(/^(https:|http:)/u).test(redirect)) {
    redirect = (/^\//u).test(redirect)
      ? { path: redirect }
      : { name: redirect };
  }
  if (typeof redirect === 'object') {
    if (!redirect.query) {
      redirect.query = {};
    }
    redirect.query.redirect = route.name.startsWith('user_login')
      ? route.query.redirect
      : route.fullPath;
  }
  return redirect;
};
