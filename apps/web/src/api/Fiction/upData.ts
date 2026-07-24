/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 10:48:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-29 15:30:11
 * @FilePath: /React-Ant/src/api/Fiction/upData.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';

/**
 * 我的小说上传接口
 */
export const upData = (file: any) => {
  const formData = new FormData();
  formData.append('file', file); // file 是你要上传的文件
  return request(`/fiction/upData`, {
    method: 'post',
    data: formData,
    headers: {},
  });
};
/**
 * 获取上传的小说列表
 */
export const getMyFictionList = () => {
  return request(`/fiction/myFictionList`, {
    method: 'get',
  });
};
/**
 * 获取对应的小说epub的基本信息
 */
export const getMyFictionItemInfo = (data: { name: string }) => {
  return request(`/fiction/myFictionItemInfo`, {
    method: 'post',
    data,
  });
};
/**
 * 使用id获取到对应的章节内容
 */
export const getMyFictionItemContent = (data: { id: string; name: string }) => {
  return request(`/fiction/myFictionItemContent`, {
    method: 'post',
    data,
  });
};
