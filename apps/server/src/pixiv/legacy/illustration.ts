/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-04 14:46:00
 * @FilePath: /node-koa-mysql/src/routes/pixiv/illustration.ts
 * @Description 获取到对应id插画的图片
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import * as pixiv from "./pixivNode";
export default async (
  ctx:
    | RouterContext & {
        request: {
          body: {
            illustID: number;
            loginInfo: {
              access_token: string;
              refresh_token: string;
              expire_time: number;
              user: any;
            };
          };
        };
      },
  next: () => any
) => {
  const { loginInfo, illustID } = ctx.request.body;
  // 使用库进行获取推荐列表
  const data = await pixiv.fetch.illustration(loginInfo, illustID);
  // 在这里发起请求进行pixiv的登录
  ctx.body = {
    data,
  };
};
