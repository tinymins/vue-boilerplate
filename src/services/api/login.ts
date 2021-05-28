/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { APIServiceBasicResponse, HttpInstance } from './api';

export interface LoginResponse extends APIServiceBasicResponse {
}

export const login = (http: HttpInstance, phone: string, code: string) => http.post<LoginResponse>('login', { phone, code }, { modal: true });
