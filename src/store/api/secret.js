/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:47:33
*/

import { http } from '@/store/api';

export const getPostList = ({ filter, point, limit, kw }) => http.get(`jx3/secret/posts/${filter}`, { params: { point, limit, kw } });
export const delPosts = id => http.delete(`jx3/secret/posts/${id}`);
export const getPosts = id => http.get(`jx3/secret/posts/${id}`);
