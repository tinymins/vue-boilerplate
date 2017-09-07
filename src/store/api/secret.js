/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:47:33
*/

import { http } from '@/store/api';

export const getPostList = (loadingText, { filter, point, limit, kw }) => http.get(`jx3/secret/posts/${filter}`, { params: { point, limit, kw } }, { loadingText });
export const delPosts = (loadingText, id) => http.delete(`jx3/secret/posts/${id}`, { loadingText });
export const getPosts = (loadingText, id) => http.get(`jx3/secret/posts/${id}`, { loadingText });
