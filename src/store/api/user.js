/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const getUser = (loadingText, strict = true) => http.get('user/profile', { strict: strict ? 'Y' : 'N' }, { loadingText, ignoreAuth: !strict });
export const login = (loadingText, phone, code) => http.post('login', { phone, code }, { loadingText, modal: true });
export const logout = loadingText => http.delete('tokens/mine', {}, { loadingText });
