/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const getPostList = (loadingText, { filter, point, limit, kw }) => http.get(`secret/posts/${filter}`, { params: { point, limit, kw } }, { loadingText });
export const delPosts = (loadingText, id) => http.delete(`secret/posts/${id}`, {}, { loadingText });
export const getPosts = (loadingText, id) => http.get(`secret/posts/${id}`, {}, { loadingText });
