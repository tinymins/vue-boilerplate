/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const getPostList = ({ filter, point, limit, kw }) => http.get(`secret/posts/${filter}`, { params: { point, limit, kw } });
export const getPosts = id => http.get(`secret/posts/${id}`);
export const delPosts = id => http.delete(`secret/posts/${id}`);
