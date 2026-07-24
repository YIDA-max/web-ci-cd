/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-30 10:22:57
 * @FilePath: /node-koa-mysql/src/routes/fiction/myFictionItemContent.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import { getMyFictionItem } from "./utils/getMyFictionItem";
import { getChapterContent } from "./utils/getEpubDataInfo";
export default async (ctx: RouterContext, next: () => any) => {
  const { name, id: chapterId } = ctx.request.body as {
    name: string;
    id: string;
  };
  const { success, data: epub, filePath } = await getMyFictionItem(name);
  if (success) {
    // 如果是 application/xhtml+xml 类型的话，就返回对应的章节内容
    if ("application/xhtml+xml" == epub.manifest[chapterId]["media-type"]) {
      ctx.body = {
        success: true,
        data: await getChapterContent(epub, chapterId, filePath),
        code: 200,
        epub,
      };
    }
  }
};
