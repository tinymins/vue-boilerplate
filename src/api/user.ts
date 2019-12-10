/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { AUTH_STATE_LIST } from '@/config/index';
import http from './driver';
import { UserFull } from './types/user';

export const getUser = (strict = true, silent = false) => http.get<UserFull>('user/profile', {
  strict: strict ? 'Y' : 'N',
}, {
  ignoreAuth: !strict,
  errcodeExpected: silent ? AUTH_STATE_LIST : [],
});
export const login = (phone, code) => http.post('login', { phone, code }, { modal: true });
export const logout = () => http.delete('tokens/mine');
