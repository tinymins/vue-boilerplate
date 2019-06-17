/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["off"] */
import qs from 'querystringify';
import VueRouter, { Location, Route } from 'vue-router';
import { equals, clone } from './util';
import { splitL } from './transfer';

export interface RouteInfo {
  fullPath?: string;
  hash?: string;
  meta?: Record<string, any>;
  path?: string;
  name?: string;
  params: Record<string, any>;
  query: Record<string, any>;
}

export interface NavLocation {
  mode: 'go' | 'push' | 'replace';
  url?: string;
  route?: RouteInfo;
}

export const routeEquals = (r1: Location, r2: Location, { ignores = {}, judges = {} }: {
  ignores?: Record<any, any>;
  judges?: Record<any, any>;
} = {}): boolean => r1 && r2
  && (ignores.name || r1.name === r2.name)
  && (ignores.query === true || equals(r1.query || {}, r2.query || {}, {
    judgeKeys: judges.query || [],
    ignoreKeys: ['reload', 'autoNav'].concat(ignores.query || []),
    ignoreValues: [void 0],
    strictType: false,
  }))
  && (ignores.params === true || equals(r1.params || {}, r2.params || {}, {
    judgeKeys: judges.params || [],
    ignoreKeys: ['reload', 'autoNav'].concat(ignores.params || []),
    ignoreValues: [void 0],
    strictType: false,
  }));

export const routeClone = (r: Route): RouteInfo => ({
  fullPath: r.fullPath,
  hash: r.hash,
  meta: r.meta,
  name: r.name,
  params: clone(r.params) || {},
  path: r.path,
  query: clone(r.query) || {},
});

export const navigateLocation = (location: NavLocation, router: VueRouter): void => {
  const mode = location.mode;
  if (mode === 'go' && location.url) {
    window.location.href = location.url;
  } else if (location.route) {
    if (mode === 'replace') {
      router.replace(location.route);
    } else {
      router.push(location.route);
    }
  }
};

export const parseNavLocation = ({ type, subType }: { type: string; subType: string }): NavLocation | undefined => {
  let location: NavLocation | undefined = void 0;
  if (type === 'web' || type === 'open') {
    location = {
      mode: 'go',
      url: subType,
    };
  } else if (type === 'page') {
    const r: RouteInfo = { params: {}, query: {} };
    switch (subType) {
      case 'tops':
        r.name = 'secret_rank';
        r.params.type = 'active';
        break;
      case 'sign':
      case 'signed':
        r.name = 'user_sign';
        break;
      case 'codes':
        r.name = 'point';
        break;
      case 'topics':
        r.name = 'discover_topics';
        break;
      case 'addon':
        r.name = 'jx3_assists';
        break;
      case 'lucky':
        r.name = 'secret_lucky';
        break;
      case 'pubg_chicken':
        r.name = 'pubg_chicken';
        break;
      case 'pubg_stats':
        r.name = 'pubg_stats';
        break;
      case 'pubg_cms':
        r.name = 'cms';
        r.params.game = 'pubg';
        break;
      case 'cities':
        r.name = 'secret_group_filters';
        r.params.group = 'cities';
        r.query.to = '/secret/posts/{{type}}/{{subType}}';
        break;
      case 'rooms':
        r.name = 'secret_group_filters';
        r.params.group = 'rooms';
        r.query.to = '/secret/{{type}}/{{subType}}';
        break;
      case 'vip':
        r.name = 'user_vip';
        break;
      case 'stuff':
        r.name = 'user_stuff';
        break;
      case 'share':
        r.name = 'user_share';
        break;
      case 'verify':
        r.name = 'user_verify';
        break;
      case 'wechat':
        r.name = 'user_wechat';
        break;
      default:
        if (subType.substr(0, 7) === 'topics_') {
          const id = subType.substr(7);
          if (id.match(/^\d+$/u)) {
            r.name = 'secret_room';
            r.params.id = id;
            r.params.subid = 'topics';
          } else {
            r.name = 'secret_list';
            r.params.type = 'topic';
            r.params.subType = id;
          }
        } else if (subType.substr(0, 7) === 'topic_') {
          const [s = null, roomid = null, topic = null] = subType.substr(7).match(/(\d+)_(.+)/u) || [];
          if (s) {
            r.name = 'secret_room';
            r.params.id = roomid;
            r.params.subid = `topic_${topic}`;
          }
        }
        break;
    }
    if (r.name) {
      location = { mode: 'push', route: r };
    }
  } else if (type === 'filters') {
    location = {
      mode: 'push',
      route: {
        name: 'secret_group_filters',
        params: { group: subType },
        query: {},
      },
    };
  } else if (type === 'room') {
    location = {
      mode: 'push',
      route: {
        name: 'secret_room',
        params: { id: subType },
        query: {},
      },
    };
  } else if (type === 'posts') {
    const [url, query = ''] = subType.split('?');
    const types = splitL(url);
    const route: RouteInfo = { params: {}, query: qs.parse(query) };
    if (types[0] === 'room') {
      const id = types.length === 2 ? types[1] : types[2];
      const subid = types.length === 2
        ? void 0
        : types.filter((_, i) => i !== 0 && i !== 2).join('_');
      route.name = 'secret_room';
      route.params = { id, subid };
    } else {
      route.name = 'secret_list';
      route.params = {
        type: types[0],
        subType: types.filter((_, i) => i !== 0).join('_') || void 0, // Can not be empty string or router will report error.
      };
    }
    location = { mode: 'push', route };
  } else if (type === 'post') {
    const [id, query = ''] = subType.split('?');
    location = {
      mode: 'push',
      route: {
        name: 'secret_detail',
        params: { id },
        query: qs.parse(query),
      },
    };
  } else if (type === 'user') {
    location = {
      mode: 'push',
      route: {
        name: 'user_other',
        params: { id: subType },
        query: {},
      },
    };
  } else if (type === 'nav') {
    location = {
      mode: 'replace',
      route: subType as unknown as RouteInfo,
    };
  } else if (type === 'order') {
    location = {
      mode: 'push',
      route: {
        name: 'play_order_detail',
        params: { id: subType },
        query: {},
      },
    };
  } else if (type === 'service') {
    location = {
      mode: 'push',
      route: {
        name: 'play_service_detail',
        params: { id: subType },
        query: {},
      },
    };
  }
  // 保证该函数如果返回的路由对象`to.route` 则必定包含完整的`params`和`query`对象 防止外部判断出错
  if (location && location.route) {
    if (!location.route.params) {
      location.route.params = {};
    }
    if (!location.route.query) {
      location.route.query = {};
    }
  }
  return location;
};

export const fillNavLocation = (data: any): NavLocation | NavLocation[] => {
  if (data instanceof Array) {
    return data.map(item => fillNavLocation(item) as NavLocation);
  }
  return Object.assign({}, data, { location: parseNavLocation(data) });
};
