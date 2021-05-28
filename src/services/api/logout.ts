/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { APIServiceBasicResponse, HttpInstance } from './api';

export interface LogoutResponse extends APIServiceBasicResponse {
}

export const logout = (http: HttpInstance) => http.delete<LogoutResponse>('tokens/mine');
