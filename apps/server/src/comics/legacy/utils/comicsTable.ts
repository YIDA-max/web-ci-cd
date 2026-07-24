/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 11:37:32
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-08 15:55:15
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/comicsTable.ts
 * @Description: 搜索漫画的方法
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
const getListInfo = ($, ele) => {
  let info = [];
  ele.each(function () {
    // 图片地址
    const imgSrc =
      "http:" +
      ($(this).find("img").attr("src")
        ? $(this).find("img").attr("src")
        : $(this).find("img").attr("data-src"));
    // 最新章节
    const ttSection = $(this).find(".tt").text();
    // 跳转地址
    const toUrl = "http://www.manhuagui.com" + $(this).find("a").attr("href");
    // 漫画名字
    const name = $(this).find("a").attr("title");
    info.push({ imgSrc, ttSection, toUrl, name });
  });
  return info;
};
/**
 * 解析查询到的搜索列表的方法
 */
export const getComicsTablHtml = async ($: CheerioAPI) => {
  const bookResult = $(".book-list ul li");
  const info = getListInfo($, bookResult);
  // 找到 div.result-count 下的所有 strong 元素
  const strongElements = $("div.result-count").find("strong");
  // 从第三个 strong 元素中获取漫画数量
  const total = $(strongElements[2]).text();
  return {
    data: info,
    total,
  };
};
