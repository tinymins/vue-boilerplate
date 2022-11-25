/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type ApiInstance, type APIServiceBasicResponse } from './api';

export interface GetJssdkConfigResponse extends APIServiceBasicResponse {
  data: {
    /** 是否为调试模式 */
    debug?: boolean;
    /** 公众号标识 */
    appId: string;
    /** 生成签名的时间戳 */
    timestamp: number;
    /** 生成签名的随机串 */
    nonceStr: string;
    /** 生成的签名 */
    signature: string;
    /** 需要使用的JS接口列表 */
    jsApiList: string[];
  };
}
export const getJssdkConfig = (api: ApiInstance, url: string, apis = '') => api.post<GetJssdkConfigResponse>('jssdk/config', { url, apis }, { silent: true });
