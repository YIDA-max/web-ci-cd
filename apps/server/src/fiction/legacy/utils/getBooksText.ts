/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 14:41:36
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-19 15:39:27
 * @FilePath: /node-koa-mysql/src/routes/fiction/utils/getBooksText.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 获取到当前小说页面的所有信息
import { CheerioAPI } from "cheerio";
const getBooksText = ($: CheerioAPI, baseUrl: string) => {
  // 获取到对应的小说章节的标题
  const title = $(".bookname h1").text();
  // 获取到对应的小说正文内容
  let foundFirstBr = false; // 标识去掉第一个br标签之前的内容
  let content = []; // 数组中存放的是每一段的内容
  let tempStr = ""; // 临时存放每一段的内容
  $("#content")
    .contents()
    .each(function () {
      if ($(this).is("br")) {
        if (!foundFirstBr) {
          foundFirstBr = true;
        } else if (tempStr.length > 0) {
          // 如果找到一个新的 <br>，并且 tempStr 中有内容，就把 tempStr 添加到数组中
          content.push(tempStr.replace(/\s/g, "")); // 去掉所有的空格
          tempStr = ""; // 重置 tempStr
        }
      } else if (foundFirstBr) {
        tempStr += $(this).text();
      }
    });
  if (tempStr.length > 0) {
    // 如果最后还有一些剩余的内容，也把它添加到数组中
    content.push(tempStr.replace(/\s/g, ""));
  }
  // 获取到上一章的链接
  const prevUrl = $(".bottem a").eq(1).attr("href");
  // 获取到下一章的链接
  const nextUrl = $(".bottem a").eq(3).attr("href");
  // 获取到原本的url
  const url = $(".bottem a").eq(2).attr("href");
  // 获取到当前小说的标题
  return { title, content, prevUrl, nextUrl, url };
};
export { getBooksText };
