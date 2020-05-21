/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 * @desc     : This file is the entry of server
 * @notice   : Server 入口文件，注意性能，API和utils是单例，需要注入请求参数。
 */

import { EntryParams } from '@/types';
import createWedge from '@/global/create-wedge';
import createVue from '@/global/create-vue';
import { COMMON } from '@/store/types';
import { checkAuthorizeRedirect } from '@/utils/authorization';
import { HttpRedirectException, NotFoundHttpException, UnauthorizedHttpException } from '@/api/driver/exception';

/**
 * 需要注入到 node 请求中的字段（转发用户的字段）
 */
const INJECT_USER_HEADERS = [
  'host',
  'origin',
  'referer',
  'cookie',
  'user-agent',
  'accept-language',
  'x-forwarded-for',
];

export default context => new Promise(async (resolve, reject) => {
  // context = {
  //   "title": "默认标题",
  //   "keywords": "keywords",
  //   "description": "description",
  //   "url": "/",
  //   "request": {
  //       "headers": {
  //           "host": "localhost:8081",
  //           "connection": "keep-alive",
  //           "cache-control": "max-age=0",
  //           "upgrade-insecure-requests": "1",
  //           "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
  //           "sec-fetch-user": "?1",
  //           "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  //           "sec-fetch-site": "none",
  //           "sec-fetch-mode": "navigate",
  //           "accept-encoding": "gzip, deflate, br",
  //           "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6",
  //           "cookie": "PHPSESSID=e4a61b3812c3de304160ca8ff0c2006c"
  //       },
  //       "protocol": "http",
  //       "ip": "::1",
  //       "hostname": "localhost"
  //   },
  //   "_registeredComponents": {}
  // }
  try {
    const { request } = context;
    let port;
    if (request.headers.host.indexOf(':') > 0) {
      port = request.headers.host.substr(request.headers.host.indexOf(':') + 1);
    } else {
      port = request.protocol === 'https' ? '443' : '80';
    }
    const entryParams: EntryParams = {
      host: request.headers.host,
      hostname: request.hostname,
      href: `${request.protocol}://${request.headers.host}${context.url}`,
      origin: `${request.protocol}://${request.headers.host}`,
      pathname: context.url,
      port,
      protocol: `${request.protocol}:`,
      userAgent: request.headers['user-agent'],
      headers: request.headers,
    };
    const headers: EntryParams['headers'] = {};
    INJECT_USER_HEADERS.forEach((k) => {
      if (request.headers[k]) {
        headers[k] = request.headers[k];
      }
    });
    const { router, store, http } = createWedge(entryParams, headers);
    store.commit(`common/app/${COMMON.STORE_INSTANCE}`, store);
    store.commit(`common/app/${COMMON.HTTP_INSTANCE}`, http);
    store.commit(`common/app/${COMMON.ROUTER_INSTANCE}`, router);
    store.commit(`common/app/${COMMON.ENTRY_PARAMS}`, entryParams);
    const app = createVue(store, router);

    let { url } = context;
    if (url.indexOf('') === 0) {
      url = url.substr(0);
    }
    const { fullPath } = router.resolve(url).route;
    if (fullPath !== url) {
      return reject(new HttpRedirectException(fullPath));
    }
    const { route } = router.resolve(url);

    // 检查是否需要重定向
    const redirect = await checkAuthorizeRedirect(store, route);
    if (redirect) {
      const { route: redirectRoute } = router.resolve(url);
      return reject(new HttpRedirectException(redirectRoute.fullPath));
    }

    router.push(url);
    return router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject(new NotFoundHttpException());
      }
      try {
        await Promise.all(matchedComponents.map((c: any) => c.asyncData && c.asyncData({
          http,
          store,
          route: router.currentRoute,
        })));
        // TODO api 做成多例后 在这里应该 unset
        // 好像不需要 会自动过滤掉 function
        context.state = store.state;
        return resolve(app);
      } catch (err) {
        if (err instanceof UnauthorizedHttpException) {
          return reject(new HttpRedirectException(context.url));
        }
        return reject(err);
      }
    });
  } catch (err) {
    return reject(err);
  }
});
