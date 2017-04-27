import Vue from 'vue';
import VueRouter from 'vue-router';
// Module Route
import topRoute from './top';
import homeRoute from './home';
import msgRoute from './msg';
import secretRoute from './secret';
import meRoute from './me';

Vue.use(VueRouter);
const routes = [].concat(
  homeRoute, msgRoute, secretRoute, meRoute,
  topRoute,
);

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
// router.beforeEach(async (to, from, next) => {
// })
// router.afterEach(route => {
// })
export default router;
