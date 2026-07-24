/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-16 17:47:49
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 10:04:00
 * @FilePath: /node-koa-mysql/src/routes/fiction/utils/getFileBooks.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 获取到当前页面所有的小说列表
import { CheerioAPI } from "cheerio";
/**
 * 获取到当前html页面的所有小说列表的信息
 * @param $
 * @returns
 */
const getbooksList = ($: CheerioAPI, current: number) => {
  return getInfo($, current);
};
/**
 * 获取到当前li下面的所有的信息
 */
const getInfo = ($: CheerioAPI, current: number) => {
  const infoList = [];
  const lis = $("#main li"); // 获取id为main的div下所有的li元素
  lis.each(function (i, elem) {
    const info: {
      tag: string;
      novelTitle: string;
      url: string;
      latestChapter: string;
      author: string;
      id: number;
    } = {
      tag: "",
      novelTitle: "",
      url: "",
      latestChapter: "",
      author: "",
      id: 0,
    };
    // 获取每个li下的所有span标签的内容
    // 获取到所有的tag标签
    const tag = $(this).find("span").eq(0).text().replace(/\[|\]/g, "");
    info.tag = tag;
    // 获取到所有的小说标题
    const novelTitle = $(this).find("a").eq(0).text();
    info.novelTitle = novelTitle;
    // 获取到所有的小说url
    const url = $(this).find("a").eq(0).attr("href");
    info.url = url;
    // 获取到所有的小说的最新章节
    const latestChapter = $(this).find("a").eq(1).text();
    info.latestChapter = latestChapter;
    // 获取到所有的小说的作者
    const author = $(this).find("span").eq(3).text();
    info.author = author;
    info.id = 40 * (current - 1) + i + 1;
    infoList.push(info);
  });
  return infoList;
};
export { getbooksList };
