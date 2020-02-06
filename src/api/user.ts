/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { AUTH_STATE_LIST } from '@/config/index';
import { HttpInstance } from './driver';
import { UserFull } from './types/user';

export const getUser = (http: HttpInstance, strict = true, silent = false) => http.get<UserFull>('user/profile', {
  strict: strict ? 'Y' : 'N',
}, {
  ignoreAuth: !strict,
  errcodeExpected: silent ? AUTH_STATE_LIST : [],
});
export const login = (http: HttpInstance, phone, code) => http.post('login', { phone, code }, { modal: true });
export const logout = (http: HttpInstance) => http.delete('tokens/mine');
