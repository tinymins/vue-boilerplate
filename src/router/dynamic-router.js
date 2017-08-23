/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-21 13:40:02
 * @Last Modified by:   Emil Zhai
 * @Last Modified time: 2017-08-23 11:33:51
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
import { isMobileDevice } from '@/utils/util';

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
  const route = isMobileDevice() ? routeM : routePC;
  return fillRouter(router, route);
};
