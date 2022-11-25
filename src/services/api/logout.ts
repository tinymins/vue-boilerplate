/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { type ApiInstance, type APIServiceBasicResponse } from './api';

export interface LogoutResponse extends APIServiceBasicResponse {
}

export const logout = (api: ApiInstance) => api.delete<LogoutResponse>('tokens/mine');
