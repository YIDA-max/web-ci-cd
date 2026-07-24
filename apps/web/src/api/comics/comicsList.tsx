/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 10:48:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 11:44:42
 * @FilePath: /React-Ant/src/api/comics/comicsList.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';
/**
 * 获取推荐漫画列表的数据
 */
export const getComicList = () => {
  return request(`/comics/getComicList`, {
    method: 'get',
  });
};
/**
 * 漫画搜索的接口关键字keyWord
 */
export const searchComics = (data: { keyWord: string }) => {
  return request(`/comics/search`, {
    method: 'post',
    data,
  });
};
/**
 * 漫画Table搜索接口
 * */
export const getComicsTable = (params: { current?: number; pageSize?: number }) => {
  return request(`/comics/comicsTable`, {
    method: 'get',
    params,
  });
};
/**
 * 漫画详情接口modal弹窗
 * */
export const getComicsInfo = (data: { toUrl: string }) => {
  return request(`/comics/getComicsInfo`, {
    method: 'post',
    data,
  });
};
