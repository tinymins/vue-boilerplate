/**
 * This file is part of the PerfMa.
 * @link     : http://perfma.com
 * @author   : William Chan (wei.chen@perfma.com)
 * @copyright: Copyright (c) 2019 Hangzhou perfma Network Technology Co., Ltd.
 */

import { EntryParams } from '@/types';
import createRouter, { type RouterInstance } from '@/router';
import createStore, { type StoreInstance } from '@/store';
import createApi, { type ApiInstance } from '@/services/api';

export interface WedgeInstance {
  store: StoreInstance;
  router: RouterInstance;
  api: ApiInstance;
}

const createWedge = (entryParams: EntryParams, headers?: EntryParams['headers']): WedgeInstance => {
  const store = createStore();
  const router = createRouter(store, entryParams);
  const api = createApi(store, router, headers);
  return { store, router, api };
};

export default createWedge;
