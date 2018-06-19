/**
 * @Author: William Chan
 * @Date:   2017-05-03 15:08:07
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-19 11:01:05
 */
/* eslint no-param-reassign: ["off"] */

// import moment from 'moment';

export const setWechatTitle = (title) => {
  document.title = title;
  // 在微信iOS webview更新到WKWebView之前我们可以通过加载一个iframe来实现单页面应用title更改。但是17年初更新到WKWebView后该方法也失效，
  // 据对开发者十分特别不友好的把所有文档放在同一个页面不能通过url区分甚至连锚点也懒得做的的微信开发文档说，3月份会修复。
  // const mobile = navigator.userAgent.toLowerCase();
  // if (/iphone|ipad|ipod/.test(mobile)) {
  //   const iframe = document.createElement('iframe');
  //   iframe.style.visibility = 'hidden';
  //   iframe.setAttribute('src', '/favicon.ico');
  //   const iframeCallback = () => {
  //     setTimeout(() => {
  //       iframe.removeEventListener('load', iframeCallback);
  //       document.body.removeChild(iframe);
  //     }, 0);
  //   };
  //   iframe.addEventListener('load', iframeCallback);
  //   document.body.appendChild(iframe);
  // }
};

export const clone = (obj) => {
  let t = obj;
  const type = typeof obj;
  if (type === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      t = [];
      obj.forEach((v, i) => {
        t[i] = clone(v);
      });
    } else {
      t = {};
      Object.keys(obj).forEach((k) => {
        t[k] = clone(obj[k]);
      });
    }
  }
  return t;
};
// export const clone = obj => JSON.parse(JSON.stringify(obj));

export const compareVersion = (v1, v2) => {
  const a1 = v1.split('.');
  const a2 = v2.split('.');
  const length = Math.max(a1.length, a2.length);
  for (let i = 0; i < length; i += 1) {
    const p1 = parseInt(a1[i] || '0', 10) || 0;
    const p2 = parseInt(a2[i] || '0', 10) || 0;
    if (p1 !== p2) {
      return p1 > p2 ? 1 : -1;
    }
    if (i === length - 1) return 0;
  }
  return 0;
};

export const equals = (p1, p2, { ignoreKeys = [], ignoreValues = [], judgeKeys = [] } = {}) => {
  if (p1 === p2) {
    return true;
  }
  if (typeof p1 !== typeof p2) {
    return false;
  }
  if (
    (p1 instanceof Object && p2 instanceof Object)
    || (p1 instanceof Array && p2 instanceof Array)
  ) {
    let k1 = Object.keys(p1);
    let k2 = Object.keys(p2);
    if (judgeKeys.length) {
      k1 = k1.filter(k => judgeKeys.includes(k));
      k2 = k2.filter(k => judgeKeys.includes(k));
    }
    if (ignoreKeys.length) {
      k1 = k1.filter(k => !ignoreKeys.includes(k));
      k2 = k2.filter(k => !ignoreKeys.includes(k));
    }
    if (ignoreValues.length) {
      k1 = k1.filter(k => !ignoreValues.includes(p1[k]));
      k2 = k2.filter(k => !ignoreValues.includes(p2[k]));
    }
    if (k1.length !== k2.length) {
      return false;
    }
    let eq = true;
    k1.forEach((k) => {
      if (eq && !equals(p1[k], p2[k], { ignoreValues, ignoreKeys })) {
        eq = false;
      }
    });
    return eq;
  }
  return false;
};

export const routeEquals = (r1, r2, { ignores = {}, judges = {} } = {}) => r1 && r2
  && (ignores.name || r1.name === r2.name)
  && (ignores.query === true || equals(r1.query || {}, r2.query || {}, {
    judgeKeys: judges.query || [],
    ignoreKeys: ['reload', 'autoNav'].concat(ignores.query || []),
    ignoreValues: [undefined],
  }))
  && (ignores.params === true || equals(r1.params || {}, r2.params || {}, {
    judgeKeys: judges.params || [],
    ignoreKeys: ['reload', 'autoNav'].concat(ignores.params || []),
    ignoreValues: [undefined],
  }));

export const routeClone = r => ({
  name: r.name,
  query: clone(r.query) || {},
  params: clone(r.params) || {},
});

export const routeJump = (route, router) => {
  const mode = route.mode;
  if (mode === 'go') {
    window.location.href = route.url;
  } else if (mode === 'replace') {
    router.replace(route.route);
  } else {
    router.push(route.route);
  }
};

export const concatPath = (...paths) =>
  paths.map((path, i) => {
    if (i === 0) {
      return path.replace(/([^/])\/+$/g, '$1');
    } else if (i === paths.length - 1) {
      return path.replace(/^\/+([^/])/g, '$1');
    }
    return path.replace(/(?:^\/+|\/+$)/g, '');
  }).filter(_ => _).join('/').replace(/(?:^\/\/|\/\/$)/g, '/');

export const updateObject = (o, { assign, offset }) => {
  if (offset) {
    Object.keys(offset).forEach((k) => {
      o[k] = (o[k] || 0) + offset[k];
    });
  }
  if (assign) Object.assign(o, assign);
};

export const getElementPath = (element) => {
  const path = [];
  while (element) {
    path.push(element);
    element = element.parentElement;
  }
  return path;
};

export const singletonPromise = (promiseGenerator, idGenerator) => {
  const promises = [];
  return (...args) => {
    const id = idGenerator(...args);
    let promiseInfo = id && promises.find(p => equals(p.id, id));
    if (!promiseInfo) {
      promiseInfo = {
        id,
        promise: new Promise((resolve, reject) =>
          promiseGenerator(...args).then((res, ...extra) => {
            resolve(res, ...extra);
          }).catch((err, ...extra) => {
            reject(err, ...extra);
          }).then(() => {
            const index = promises.findIndex(p => equals(p.id, id));
            if (index >= 0) {
              promises.splice(index, 1);
            }
          })),
      };
      promises.push(promiseInfo);
    }
    return promiseInfo.promise;
  };
};

const getAbsPos = ($element) => {
  let top = $element.offsetTop;
  let left = $element.offsetLeft;
  // const style = getComputedStyle($element);
  // top += parseInt(style.marginTop, 10);
  // left += parseInt(style.marginLeft, 10);
  $element = $element.parentElement;
  while ($element && $element !== document.documentElement) {
    top += $element.offsetTop;
    left += $element.offsetLeft;
    if ($element.parentElement) {
      top -= $element.parentElement.scrollTop;
      left -= $element.parentElement.scrollLeft;
    }
    $element = $element.parentElement;
  }
  return { top, left };
};

export const getElementPos = ($target, $base = document.documentElement) => {
  const { top: baseTop, left: baseLeft } = getAbsPos($base);
  const { top: targetTop, left: targetLeft } = getAbsPos($target);
  return { top: targetTop - baseTop, left: targetLeft - baseLeft };
};

// TODO: complete format param
export const formatDuration = (duration/* , format = 'MM:ss' */) => {
  const hour = Math.floor(duration / 3600);
  const minute = Math.floor((duration / 60) % 60);
  const minuteString = minute >= 10 ? minute.toString(10) : `0${minute}`;
  const second = Math.floor(duration % 60);
  const secondString = second >= 10 ? second.toString(10) : `0${second}`;
  return hour > 0 ? `${hour}:${minuteString}:${secondString}` : `${minuteString}:${secondString}`;
};

export const createObjectProxy = (proxy, object, {
  setter,
  onset,
  getter,
  keys = Object.keys(object),
} = {}) => {
  keys.forEach((k) => {
    Object.defineProperty(
      proxy,
      k,
      {
        configurable: true,
        set: ((val) => {
          if (setter) {
            setter(object, k, val);
          } else {
            object[k] = val;
          }
          if (onset) onset(object, k, val);
        }),
        get: (() => (getter ? getter(object, k) : object[k])),
      },
    );
  });
  return proxy;
};

export const randomChild = list => list[Math.floor(Math.random() * list.length) % list.length];
