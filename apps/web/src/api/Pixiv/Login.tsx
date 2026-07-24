/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 19:51:20
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-30 19:19:46
 * @FilePath: /React-Ant/src/api/Pixiv/Login.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';

/**
 * 通过发起请求获取到用户信息
 * */
export const LoginInfo = (AUTH_CODE: string, code_verifier: string) => {
  return request<{
    data: any;
    status: number;
  }>('/pixiv/logo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      AUTH_CODE,
      code_verifier,
    },
  });
};
/**
 * 刷新token
 */
export const RefreshToken = (refresh_token: string) => {
  return request<{
    data: any;
  }>('/pixiv/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      refresh_token,
    },
  });
};
