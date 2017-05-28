import Vue from 'vue';
import VueRouter from 'vue-router';
import { isDevelop, setWechatTitle } from '@/utils/util';
// Module Route
import topRoute from '@/router/top';
import homeRoute from '@/router/home';
import msgRoute from '@/router/msg';
import secretRoute from '@/router/secret';
import meRoute from '@/router/me';
import debugeRoute from '@/router/debug';
import { getAuthorization } from '@/store';

Vue.use(VueRouter);
let routes = [].concat(
  homeRoute, msgRoute, secretRoute, meRoute,
  topRoute,
);

if (isDevelop()) {
  routes = routes.concat(debugeRoute);
}
const router = new VueRouter({
  base: __dirname,
  // base: 'test',
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
// router.beforeResolve via 2.5.0+
// In 2.5.0+ you can register a global guard with router.beforeResolve.
// This is similar to router.beforeEach,
// with the difference that resolve guards will be called right before the navigation is confirmed,
// after all in-component guards and async route components are resolved.
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  let params;
  const user = await getAuthorization();
  if (!user) {
    if (requiresAuth) {
      params = { name: 'debug', query: { redirect: to.fullPath } };
    }
  } else if (!requiresAuth) {
    if (to.query.redirect) {
      params = { path: to.query.redirect };
    }
  }
  next(params);
});

router.afterEach((route) => {
  if (route.meta.title) {
    setWechatTitle(route.meta.title);
  }
});
// router.onError((callback) => {
//   console.log(callback);
// });
//
export default router;
