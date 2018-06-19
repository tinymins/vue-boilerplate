/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-21 13:40:02
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
import { isInMobileDevice } from '@/utils/environment';

const fillRouter = (router, settings) => {
  router.forEach((item) => {
    const setting = settings.find(r => r.name === item.name);
    if (!setting) {
      return;
    }
    Object.keys(setting).forEach((k) => {
      if (k === 'name' || k === 'children') {
        return;
      }
      item[k] = setting[k];
    });
    if (item.children && setting.children) {
      item.children = fillRouter(item.children, setting.children);
    }
  });
  return router;
};

export default (router, routeM, routePC) => {
  const route = isInMobileDevice() ? routeM : routePC;
  return fillRouter(router, route);
};
