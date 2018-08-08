/**
 * This file is part of Emil's vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 tinymins.
 */
import { isLocalhost } from '@/utils/environment';

export const SLOW_API_TIME = 300;
export const MAX_API_RETRY_COUNT = 3;
export const BASE_HOST = (() => {
  if (isLocalhost()) {
    return 'https://dev.haimanchajian.com/';
  }
  return `${window.location.origin}/`;
})();
export const BASE_API_HOST = `${BASE_HOST}api`;
export const WECHAT_AUTH_URL = `${BASE_API_HOST}/authorize?mode={{reason}}&service={{service}}&redirect_uri={{redirect}}`;
