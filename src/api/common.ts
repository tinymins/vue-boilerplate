/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Http from './driver/http';

export const getWechatSDKInfo = (http: Http, url, apis = '') => http.post('jssdk/config', { url, apis }, { silent: true });
