/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 11:37:32
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-06 16:08:28
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/searchHtml.ts
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
    const imgSrc = "http:" + $(this).find("img").attr("src");
    // 最新章节
    const ttSection = $(this).find(".tt").text();
    // 跳转地址
    const toUrl = "http://www.manhuagui.com" + $(this).find("a").attr("href");
    // 漫画名字
    const name = $(this).find("a").attr("title");
    // 漫画简介
    const desc = $(this).find(".intro").text();
    // 状态
    const status = $(this).find(".status").text();
    // 标签
    const keywords = ["年份：", "地区：", "类型：", "作者：", "别名："];
    const regex = new RegExp(keywords.join("|"), "g");
    const tags = $(this)
      .find(".tags")
      .slice(1)
      .text()
      .split(regex)
      .filter((item) => item)
      .map((item, index) => {
        if (item)
          return {
            [keywords[index]]: item,
          };
      })
      .reduce(function (acc, tag) {
        let key = Object.keys(tag)[0]; // 获取对象的键（假设每个对象只有一个键值对）
        acc[key] = tag[key]; // 将键值对添加到累积器对象中
        return acc;
      }, {});
    info.push({ imgSrc, ttSection, toUrl, name, desc, status, tags });
  });
  return info;
};
// 查找是否有下一页的方法
export const searchNextPage = async ($: CheerioAPI) => {
  const hrefs = [];
  // 如果存在这个id，说明有下一页
  $("#AspNetPagerResult a").each((i, link) => {
    hrefs.push($(link).attr("href"));
  });
  const AxiosList = [...new Set(hrefs)];
  const infos = [];
  while (AxiosList.length) {
    const url = AxiosList.pop();
    const html = await axios.get(`https://www.manhuagui.com${url}`, {
      headers: {
        "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Cookie: "country=CN",
        Host: "www.manhuagui.com",
        Pragma: "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
      },
    });
    const $ = load(html.data);
    const bookResult = $(".book-result ul li");
    const info = getListInfo($, bookResult);
    infos.push(...info);
  }
  return infos;
};
/**
 * 解析查询到的搜索列表的方法
 */
export const searchHtml = async ($: CheerioAPI) => {
  const bookResult = $(".book-result ul li");
  const infos = await searchNextPage($);
  const info = getListInfo($, bookResult);
  return [...info, ...infos];
};
