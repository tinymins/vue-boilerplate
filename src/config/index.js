/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2017-08-22 19:32:30
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-07 14:34:56
 */
import { isDevelop } from '@/utils/environment';

export const BASE_API_HOST = isDevelop() ? 'https://dev.haimanchajian.com/api' : '/api';
export const WECHAT_LOGIN_URL = '/api/authorize?mode=wx';
export const SLOW_API_TIME = 300;
