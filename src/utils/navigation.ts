/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import VueRouter, { Route } from 'vue-router';
import { equals } from './util';

export interface RouteInfoPartial {
  fullPath?: string;
  hash?: string;
  meta?: Record<string, unknown>;
  path?: string;
  name?: string | null;
  params?: Route['params'] | Record<string, string>;
  query?: Route['query'] | Record<string, string>;
}

export interface RouteInfo extends RouteInfoPartial {
  name?: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface NavLocationData {
  type: string;
  subType: string;
}

export type NavLocation =
  {
    mode: 'go';
    url: string;
  }
  | {
    mode: 'push' | 'replace';
    route: RouteInfo;
  }

export const routeEquals = (r1: RouteInfoPartial, r2: RouteInfoPartial, { ignores = {}, judges = {} }: {
  ignores?: {
    name?: string;
    params?: boolean | string[];
    query?: boolean | string[];
  };
  judges?: {
    name?: string;
    params?: string[];
    query?: string[];
  };
} = {}): boolean => {
  if (!r1 || !r2) {
    return false;
  }
  if (!ignores.name && r1.name !== r2.name) {
    return false;
  }
  if (ignores.query !== true && !equals(r1.query || {}, r2.query || {}, {
    judgeKeys: judges.query || [],
    ignoreKeys: ['reload', 'autoNav', ...ignores.query || []],
    ignoreValues: [void 0],
    strictType: false,
  })) {
    return false;
  }
  if (ignores.params !== true && !equals(r1.params || {}, r2.params || {}, {
    judgeKeys: judges.params || [],
    ignoreKeys: ['reload', 'autoNav', ...ignores.params || []],
    ignoreValues: [void 0],
    strictType: false,
  })) {
    return false;
  }
  return true;
};

export const routeClone = (r: Route | RouteInfo | RouteInfo): Required<RouteInfo> => {
  const route: Required<RouteInfo> = {
    fullPath: r.fullPath || '',
    hash: r.hash || '',
    meta: r.meta || {},
    name: r.name || '',
    params: {},
    query: {},
    path: r.path || '',
  };
  if (r.params) {
    Object.entries(r.params).forEach(([k, v]) => {
      if (v !== null && v !== void 0) {
        route.params[k] = String(v);
      }
    });
  }
  if (r.query) {
    Object.entries(r.query).forEach(([k, v]) => {
      if (v !== null && v !== void 0) {
        route.query[k] = String(v);
      }
    });
  }
  return route;
};

export const navigateLocation = (location: NavLocation, router: VueRouter): void => {
  if (location.mode === 'go' && location.url) {
    window.location.href = location.url;
  } else if ((location.mode === 'push' || location.mode === 'replace') && location.route) {
    if (location.mode === 'replace') {
      router.replace(location.route);
    } else {
      router.push(location.route);
    }
  }
};

export const parseNavLocation = ({ type, subType }: NavLocationData): NavLocation | undefined => {
  let location: NavLocation | undefined = void 0;
  if (type === 'web' || type === 'open') {
    location = {
      mode: 'go',
      url: subType,
    };
  } else if (type === 'page') {
    const r: RouteInfo = { params: {}, query: {} };
    switch (subType) {
      case 'me':
        r.name = 'user_me';
        break;
      default:
        r.name = 'index';
        break;
    }
    if (r.name) {
      location = { mode: 'push', route: r };
    }
  }
  // 保证该函数如果返回的路由对象`to.route` 则必定包含完整的`params`和`query`对象 防止外部判断出错
  if (location && (location.mode === 'push' || location.mode === 'replace') && location.route) {
    if (!location.route.params) {
      location.route.params = {};
    }
    if (!location.route.query) {
      location.route.query = {};
    }
  }
  return location;
};

export const fillNavLocation = <T extends NavLocationData = NavLocationData>(data: T): { location?: NavLocation } & T => {
  const location = parseNavLocation(data);
  return Object.assign({}, data, { location });
};
