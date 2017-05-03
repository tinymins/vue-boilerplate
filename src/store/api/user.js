/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';


export const getUser = () => http.get('profile');
export const debugLogin = ({ phone, code }) => http.post('login', { phone, code });
