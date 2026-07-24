/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-29 19:32:54
 * @FilePath: /node-koa-mysql/src/routes/pixiv/logo.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了,不需要纠结其他的 模仿登录失败,看起来pixiv网站是需要某种密码进行验证才能登录的
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { enums } from "./pixivNode/constants/enums";
import qs from "qs";
export default async (
  ctx:
    | RouterContext & {
        request: {
          body: {
            AUTH_CODE: string;
            code_verifier: string;
          };
        };
      },
  next: () => any
) => {
  const { AUTH_CODE, code_verifier } = ctx.request.body;
  const { data } = await axios(enums.AUTH_URL, {
    method: "POST",
    data: qs.stringify({
      client_id: enums.CLIENT_ID,
      client_secret: enums.CLIENT_SECRET,
      code: AUTH_CODE,
      code_verifier: code_verifier,
      grant_type: "authorization_code",
      include_policy: true,
      redirect_uri: `${enums.API_BASE_URL}/web/v1/users/auth/pixiv/callback`,
    }),
    headers: {
      "User-Agent": "PixivAndroidApp/5.0.234 (Android 11; Pixel 5)",
    },
  });
  // 在这里发起请求进行pixiv的登录
  ctx.body = {
    data,
  };
};
