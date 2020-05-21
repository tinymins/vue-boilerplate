/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
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

const createWedge = (entryParams: EntryParams, headers?: EntryParams['headers']): WedgeInstance => {
  const store = createStore();
  const router = createRouter(store, entryParams);
  const http = createHttp(store, router, headers);
  return { router, store, http };
};

export default createWedge;
