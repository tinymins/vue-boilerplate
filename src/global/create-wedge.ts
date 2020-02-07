/**
 * This file is part of the PerfMa.
 * @link     : http://perfma.com
 * @author   : William Chan (wei.chen@perfma.com)
 * @copyright: Copyright (c) 2019 Hangzhou perfma Network Technology Co., Ltd.
 */

import { EntryParams } from '@/types';
import createStore, { StoreInstance } from '@/store';
import createRouter, { RouterInstance } from '@/router';
import createHttp, { HttpInstance } from '@/api/driver';

export interface WedgeInstance {
  store: StoreInstance;
  router: RouterInstance;
  http: HttpInstance;
}

const createWedge = (headers?: EntryParams['headers']): WedgeInstance => {
  const store = createStore();
  const router = createRouter(store);
  const http = createHttp(store, router, headers);
  return { router, store, http };
};

export default createWedge;
