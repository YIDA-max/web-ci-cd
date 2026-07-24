/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 10:48:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-15 14:58:55
 * @FilePath: /React-Ant/src/api/comics/comicsView.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';
/**
 * 获取推荐漫画具体信息的的数据
 */
export const getViewComicChapter = (data: { toUrl: string }) => {
  return request(`/comics/getComicsChapter`, {
    method: 'post',
    data,
  });
};
/**
 * 获取推荐漫画具体的某一张图片的数据
 */
export const getViewComicsImg = (data: {
  sl: {
    e: number;
    m: string;
  };
  cid: number;
  path: string;
  file: string;
}) => {
  return request(`/comics/getComicsImg`, {
    method: 'post',
    data,
  });
};
