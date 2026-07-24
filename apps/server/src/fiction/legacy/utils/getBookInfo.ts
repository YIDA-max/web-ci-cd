/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 14:41:36
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 15:31:59
 * @FilePath: /node-koa-mysql/src/routes/fiction/utils/getBookInfo.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 获取到当前小说页面的所有信息
import { CheerioAPI } from "cheerio";
const getBooksInfo = ($: CheerioAPI, baseUrl: string) => {
  // 获取到小说的简介
  const intro = $("#intro").text();
  // 寻找第二个dt的标识
  let dtCount = 0;
  // 获取到小说列表
  let links = [];
  $("#list dl")
    .children()
    .each(function (i, elem) {
      if ($(this).is("dt")) {
        dtCount++;
      } else if (
        // 如果我们已经找到至少两个 dt，就开始处理 dd, 而且里面有a标签
        $(this).is("dd") &&
        dtCount >= 2 &&
        $(this).find("a").is("a")
      ) {
        links.push({
          title: $(this).find("a").text(),
          url: baseUrl + $(this).find("a").attr("href"),
        });
      }
    });

  let cover = "";
  $("head meta").each(function (i, elem) {
    let content = $(this).attr("content");
    if (content && content.startsWith("https") && content.endsWith("jpg")) {
      cover = content;
    }
  });
  return { intro, links, cover };
};
export { getBooksInfo };
