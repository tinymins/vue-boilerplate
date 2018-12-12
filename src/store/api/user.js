/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const login = (phone, code) => http.post('login', { phone, code }, { modal: true });
export const logout = () => http.delete('tokens/mine');
export const getUser = (strict = true) => http.get('user/profile', { strict: strict ? 'Y' : 'N' }, { ignoreAuth: !strict });
