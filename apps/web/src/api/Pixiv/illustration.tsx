/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 19:51:20
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-04 14:52:23
 * @FilePath: /React-Ant/src/api/Pixiv/illustration.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';

/**
 * 根据获取到详细的信息
 * */
export const getIllustrationInfo = (
  loginInfo: {
    access_token: string;
    refresh_token: string;
    user: any;
  },
  illustID: number,
) => {
  return request<{
    data: any;
    status: number;
  }>('/pixiv/illustration', {
    method: 'POST',
    data: {
      loginInfo,
      illustID,
    },
  });
};
