/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
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
