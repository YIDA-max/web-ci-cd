/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-22 15:07:31
 * @FilePath: /node-koa-mysql/src/routes/fiction/upData.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
export default async (ctx: RouterContext | any, next: () => any) => {
  // 检查是否有文件上传
  if (ctx.request.files && ctx.request.files.file) {
    const files = Array.isArray(ctx.request.files.file)
      ? ctx.request.files.file
      : [ctx.request.files.file];
    for (const file of files) {
      // console.log(file); // 打印上传的文件信息
    }
    ctx.body = {
      code: 200,
      data: "文件上传成功",
      success: true,
    };
  } else {
    ctx.app.emit("error", "1004", ctx);
  }
};
