/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { StoreRootState } from '@/store';

declare global {
  interface Window {
    chrome?: any;
    __INITIAL_STATE__: StoreRootState;
  }
}
