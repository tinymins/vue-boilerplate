/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { APIServiceBasicResponse, ApiInstance } from './api';

export interface LoginResponse extends APIServiceBasicResponse {
}

export const login = (api: ApiInstance, phone: string, code: string) => api.post<LoginResponse>('login', { phone, code }, { modal: true });
