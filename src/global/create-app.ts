/**
 * This file is part of the PerfMa.
 * @link     : http://perfma.com
 * @author   : William Chan (wei.chen@perfma.com)
 * @copyright: Copyright (c) 2019 Hangzhou perfma Network Technology Co., Ltd.
 */

import Vue from 'vue';
import createStore, { StoreInstance } from '@/store';
import createRouter, { RouterInstance } from '@/router';
import createHttp, { HttpInstance } from '@/api/driver';
import '@/styles/index.scss';
import createVue from '@/global/create-vue';

export interface AppInstance {
  app: Vue;
  store: StoreInstance;
  router: RouterInstance;
  http: HttpInstance;
}

const createApp = (): AppInstance => {
  const store = createStore();
  const router = createRouter(store);
  const http = createHttp(store, router);
  const app = createVue(store, router);
  return { app, router, store, http };
};

export default createApp;
