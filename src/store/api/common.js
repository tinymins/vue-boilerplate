/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable camelcase */
import { http } from '@/store/api';

export const getWechatSDKInfo = (url, apis = '') => http.post('jssdk/config', { url, apis }, { silent: true });
