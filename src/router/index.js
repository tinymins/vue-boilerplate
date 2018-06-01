import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { setWechatTitle, routeEquals } from '@/utils/util';
import { isDevelop, isInWechat } from '@/utils/environment';
import { getAuthorization } from '@/utils/authorization';
// Module Route
import indexRoute from '@/router/basic/index';
import msgRoute from '@/router/basic/msg';
import secretRoute from '@/router/basic/secret';
import userRoute from '@/router/basic/user';
import ProgressBar from '@/components/progressbar';
import { WECHAT_LOGIN_URL } from '@/config';

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

Vue.use(VueRouter);
const routes = [].concat(
  msgRoute, secretRoute, userRoute,
  indexRoute,
);

const router = new VueRouter({
  base: __dirname,
  // base: 'test',
  routes,
  mode: 'history',
  scrollBehavior: (to, from) => (routeEquals(to, from) ? null : {
    x: 0,
    y: to.query.reload ? 0 : store.state.common.scrolls[to.fullPath] || 0,
  }),
});

const restoreScrollPos = () => {
  const from = store.state.common.route.from;
  if (from && store.state.common.scrolls[from.fullPath]) {
    window.scrollTo(0, store.state.common.scrolls[from.fullPath]);
  }
};
window.addEventListener('popstate', () => {
  const onScroll = () => {
    window.removeEventListener('scroll', onScroll);
    restoreScrollPos();
  };
  window.addEventListener('scroll', onScroll);
});
window.addEventListener('hashchange', restoreScrollPos);

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  let diffed = false;
  const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));

  // Deal with Vue.use() of current component.
  activated.map(c => c.uses).filter(_ => _).forEach((uses) => {
    Object.values(uses).forEach(entity => Vue.use(entity));
  });

  // Deal with async data of current component.
  const success = () => {
    bar.finish();
    next();
  };
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
  if (!asyncDataHooks.length) {
    success();
  } else {
    const promises = asyncDataHooks.map(hook => hook({ store, route: to, router }));
    const failure = (err) => {
      const ignore = !err || err.message === 'REDIRECT' || (
        err.response && err.response.data && err.response.data.errcode === 401
      );
      if (!ignore) {
        console.error(err);
      }
      bar.abort();
      next(false);
    };
    Promise.all(promises).then(success).catch(failure);
  }
});

router.beforeEach(async (to, from, next) => {
  bar.start();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiresDevelop = to.matched.some(record => record.meta.requiresDevelop);
  let redirect;
  const status = (requiresAuth || requiresGuest) ? await getAuthorization() : null;
  if (requiresDevelop && !isDevelop()) {
    redirect = { name: 'index' };
  } else if (status === 401 && requiresAuth) {
    if (isInWechat() && WECHAT_LOGIN_URL) {
      window.location = WECHAT_LOGIN_URL;
    } else {
      redirect = { name: 'user_login', query: { redirect: to.fullPath } };
    }
  } else if (status !== 401 && requiresGuest) {
    redirect = { name: 'user' };
  } else if (status === 200 && to.query.redirect) {
    redirect = { path: to.query.redirect };
  }
  if (!redirect) {
    store.commit('common/COMMON_SAVE_SCROLL', {
      scroll: window.scrollY,
      fullPath: from.fullPath,
    });
  }
  next(redirect);
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
