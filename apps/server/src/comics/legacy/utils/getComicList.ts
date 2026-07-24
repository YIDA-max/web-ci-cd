/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 11:37:32
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-06 11:02:07
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/getComicList.ts
 * @Description: 获取漫画列表
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { CheerioAPI } from "cheerio";
const getListInfo = ($, ele) => {
  let info = [];
  ele.each(function () {
    if (
      $(this).find("img").attr("src") ||
      $(this).find("img").attr("data-src")
    ) {
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
    } else {
      // 跳转地址
      const toUrl = "http://www.manhuagui.com" + $(this).find("a").attr("href");
      // 漫画名字
      const name = $(this).find("a").attr("title");
      info.push({ toUrl, name });
    }
  });
  return info;
};
/**
 * 解析html然后返回有点漫画列表的方法
 */
export const getHtmlInfo = async ($: CheerioAPI) => {
  // 热门推荐
  let hotRecommendations = getListInfo($, $("#updateWrap ul li"));
  // 热门连载
  let hotOngoingManga = [];
  // 经典完结
  let classicFinished = [];
  // 最新上架
  let latestShelves = [];
  // 新番漫画
  let newSeriesManga = [];
  const cmtCont = $(".cmt-cont ul");
  cmtCont.each(function (i, element) {
    switch (i) {
      case 0:
        hotOngoingManga = getListInfo($, $(this).find("li"));
        break;
      case 1:
        classicFinished = getListInfo($, $(this).find("li"));
        break;
      case 2:
        latestShelves = getListInfo($, $(this).find("li"));
        break;
      case 3:
        newSeriesManga = getListInfo($, $(this).find("li"));
        break;
      default:
        break;
    }
  });
  // 漫画推荐大全
  let mangaRecommendations = getListInfo(
    $,
    $(
      "#serialCont, #finishCont, #tlkbxyCont, #bhhgzyCont, #shlszzCont, #xylzmxCont"
    )
      .find("ul")
      .find("li")
  );
  return {
    hotRecommendations,
    hotOngoingManga,
    classicFinished,
    latestShelves,
    newSeriesManga,
    mangaRecommendations,
  };
};
