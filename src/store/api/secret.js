/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 00:51:25
*/

import { http } from '@/store/api';

export const getPosts = ({ filter, point, limit, kw }) => http.get(`secret/posts/${filter}`, { params: { point, limit, kw } });
export const getUser2 = ({ filter, point, limit, kw }) => http.get(`secret/posts/${filter}`, { params: { point, limit, kw } });
