/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Route, RouteRecord, Location } from 'vue-router';

const DEFAULT_TABBAR_CATEGORY = 'main';

export interface TabbarInfo {
  category: string;
  name: string;
}

export const getTabbarInfo = (route: Route): TabbarInfo => {
  let tabbar = route.meta.tabbar as string;
  Object.values(route.matched).forEach((r: RouteRecord) => {
    if (r.meta.tabbar) {
      tabbar = typeof r.meta.tabbar === 'function'
        ? r.meta.tabbar(route)
        : r.meta.tabbar;
    }
  });
  const tabbars = tabbar.split('/');
  const category = tabbars.length <= 1
    ? DEFAULT_TABBAR_CATEGORY
    : tabbars.shift() as string;
  const name = tabbars.join('/');
  return { category, name };
};

export interface TabbarSubItemData {
  name: string;
  text: string;
  route?: Location;
  badge?: string | number;
  children?: TabbarSubItemData[];
}

export interface TabbarItemData extends TabbarSubItemData {
  rememberRoute?: boolean;
  popupIcon?: boolean;
  static?: boolean;
}

export const getTabbarData = (route: Route): TabbarItemData[] => {
  const tabbarInfo = getTabbarInfo(route);
  if (tabbarInfo.category === 'main') {
    return [
      {
        name: 'index',
        text: '首页',
        route: { name: 'index' },
        rememberRoute: false,
      },
      {
        name: 'user',
        text: '我的',
        route: { name: 'user' },
        rememberRoute: false,
      },
    ];
  }
  return [];
};
