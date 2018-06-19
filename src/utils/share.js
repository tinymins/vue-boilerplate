/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-06-08 17:37:05
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
/* eslint no-param-reassign: ["off"] */
import Vue from 'vue';
import store from '@/store';
import { routeClone, routeEquals, concatPath } from '@/utils/util';
import { BASE_ROUTE } from '@/config/environment';

let lastShareRoute;
export const setWechatShare = ({
  title,
  desc = '',
  link = null,
  route = store.state.common.route.current,
  imgUrl = 'https://haiman.io/img/logo.png',
  overwrite = true,
}) => {
  if (!overwrite && routeEquals(route, lastShareRoute)) {
    return;
  }
  lastShareRoute = routeClone(route);

  if (!link) {
    link = concatPath(window.location.origin, BASE_ROUTE, route.fullPath);
  }
  const user = store.getters['user/user'];
  if (user) {
    link += link.indexOf('?') > 0 ? '&' : '?';
    link += `__from_uid=${user.id.toString(16)}`;
  }
  link = link.replace(/([^/:])\/{2,}/g, '$1/');
  Vue.wechat.onMenuShareTimeline({ title: `${title} ${desc}`, link, imgUrl, success: () => { }, cancel: () => { } });
  Vue.wechat.onMenuShareAppMessage({ title, desc, link, imgUrl, type: 'link', dataUrl: '', success: () => { }, cancel: () => { } });
  Vue.wechat.onMenuShareQQ({ title, desc, link, imgUrl, success: () => { }, cancel: () => { } });
  Vue.wechat.onMenuShareWeibo({ title, desc, link, imgUrl, success: () => { }, cancel: () => { } });
};
