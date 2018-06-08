/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-06-08 17:01:53
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-06-08 17:27:44
 */
/* eslint-disable camelcase */
import { http } from '@/store/api';

export const getWechatSDKInfo = (url, apis = '') => http.post('jssdk/config', { url, apis }, { silent: true });
