/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["off"] */
import Vue from 'vue';
import store from '@/store';
import { routeClone, routeEquals, concatPath } from '@/utils/util';
import { ICON_URL } from '@/config';
import { isInWechatMobile } from './environment';

let lastShareRoute;
export const setWechatShare = ({
  title,
  desc = '',
  link = null,
  route = store.state.common.route.current,
  imgUrl = ICON_URL,
  overwrite = true,
  success = () => {},
  cancel = () => {},
}) => {
  if (!overwrite && routeEquals(route, lastShareRoute)) {
    return;
  }
  lastShareRoute = routeClone(route);

  if (!link) {
    link = concatPath(window.location.origin, process.env.PUBLIC_PATH, route.fullPath);
  }
  const user = store.getters['user/user'];
  if (user) {
    link += link.indexOf('?') > 0 ? '&' : '?';
    link += `__from_uid=${user.id.toString(16)}`;
  }
  link = link.replace(/([^/:])\/{2,}/gu, '$1/');
  Vue.wechat.onMenuShareTimeline({ title: `${title} ${desc}`, link, imgUrl, success, cancel });
  Vue.wechat.onMenuShareAppMessage({ title, desc, link, imgUrl, type: 'link', dataUrl: '', success, cancel });
  Vue.wechat.onMenuShareQQ({ title, desc, link, imgUrl, success, cancel });
  Vue.wechat.onMenuShareWeibo({ title, desc, link, imgUrl, success, cancel });
  Vue.wechat.onMenuShareQZone({ title, desc, link, imgUrl, success, cancel });
};

export const checkWepayReqirement = () => {
  if (isInWechatMobile() && window.location.pathname.trim('/') !== process.env.PUBLIC_PATH.trim('/')) {
    window.location.replace(`${process.env.PUBLIC_PATH}?_=${(new Date()).valueOf()}${window.location.hash}`);
    return false;
  }
  return true;
};
