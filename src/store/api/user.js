/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';

export const login = (loadingText, name, code) => http.post('login', { phone: name, code }, { loadingText });
export const logout = loadingText => http.delete('tokens/mine', { loadingText });
export const getUser = loadingText => http.get('jx3/user/profile', { loadingText });
