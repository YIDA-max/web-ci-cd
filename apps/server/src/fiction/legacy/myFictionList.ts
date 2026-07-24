/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-22 16:35:44
 * @FilePath: /node-koa-mysql/src/routes/fiction/myFictionList.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了,不需要纠结其他的 模仿登录失败,看起来pixiv网站是需要某种密码进行验证才能登录的
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import { queryNovels } from "./utils/getMyFictionList";
export default async (ctx: RouterContext, next: () => any) => {
  const data = queryNovels();
  if (data.success) {
    ctx.body = {
      code: 200,
      data: data.data,
      success: true,
    };
  } else {
    ctx.app.emit("error", "1005", ctx);
  }
};
