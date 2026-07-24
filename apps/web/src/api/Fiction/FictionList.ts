/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 10:48:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 17:05:34
 * @FilePath: /React-Ant/src/api/Fiction/FictionList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';

/**
 * 获取推荐小说列表的数据
 */
export const getBookList = (current: number, keyword?: string) => {
  return request(`/fiction/books/${current}`, {
    method: 'get',
    params: {
      keyword,
    },
  });
};
/**
 * 查询小说接口
 */
export const searchBook = (keyword: string) => {
  return request(`/fiction/search`, {
    method: 'get',
    params: {
      keyword,
    },
  });
};
/**
 * 获取小说详情
 */
export const getBookDetail = (url: string) => {
  return request(`/fiction/content`, {
    method: 'post',
    data: {
      url,
    },
  });
};
/**
 * 获取小说内容
 */
export const getBookText = (url: string) => {
  return request(`/fiction/text`, {
    method: 'post',
    data: {
      url,
    },
  });
};
