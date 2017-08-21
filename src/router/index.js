import Vue from 'vue';
import VueRouter from 'vue-router';
import { store, getAuthorization } from '@/store';
import { isDevelop, setWechatTitle } from '@/utils/util';
// Module Route
import topRoute from '@/router/basic/top';
import homeRoute from '@/router/basic/home';
import msgRoute from '@/router/basic/msg';
import secretRoute from '@/router/basic/secret';
import meRoute from '@/router/basic/me';
import debugeRoute from '@/router/basic/debug';
import ProgressBar from '@/components/progressbar';

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

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

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
  if (!asyncDataHooks.length) {
    bar.finish();
    next();
  } else {
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(() => {
      bar.finish();
      next();
    }).catch(next);
  }
});

router.beforeEach(async (to, from, next) => {
  bar.start();
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
