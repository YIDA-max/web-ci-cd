/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 11:37:32
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 14:57:09
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/getComicsInfo.ts
 * @Description: 搜索漫画的方法
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
/**
 * 获取到漫画的简介的方法
 * @param $
 * @returns
 */
const getheand = ($: CheerioAPI) => {
  // 使用Cheerio的选择器API从HTML中提取信息
  // 获取到漫画的标题
  const title = $(".book-title").text();
  // 从HTML中筛选出含有"漫画作者"的元素并获取作者名
  const author = $(".detail-list a[title]")
    .filter((i, el) => $(el).parent().text().startsWith("漫画作者"))
    .text();
  // 从HTML中筛选出含有"出品年代"的元素并获取年份
  const year = $(".detail-list a")
    .filter((i, el) => $(el).parent().text().startsWith("出品年代"))
    .text();
  // 获取漫画的状态，如"已完结"
  const status = $(".status .dgreen").text();
  // 获取最后更新日期
  const updateDate = $(".status .red").text();
  // 获取最新章节
  const updateChapter = $(".status a").text();
  // 获取简单介绍
  const intro = $("#intro-cut").text();
  // 获取完整介绍
  const allIntro = $("#intro-all").text();
  // 从HTML中筛选出含有"漫画地区"的元素并获取地区
  const area = $(".detail-list a[title]")
    .filter((i, el) => $(el).parent().text().startsWith("漫画地区"))
    .text();
  // 从HTML中筛选出含有"漫画别名"的元素并获取别名，通过`.slice(6)`来剔除前面的"漫画别名："文字
  const alias = $(".detail-list span")
    .filter((i, el) => $(el).parent().text().startsWith("漫画别名"))
    .text()
    .slice(6);
  // 从HTML中筛选出含有"漫画剧情"的元素并获取剧情，可能包含多个剧情，所以使用map将所有的剧情收集到一个数组中并使用join方法将它们转化为以逗号分隔的字符串
  const plot = $(".detail-list a[title]")
    .filter((i, el) => $(el).parent().text().startsWith("漫画剧情"))
    .map((i, el) => $(el).text())
    .get()
    .join(", ");
  // 返回包含所有提取信息的对象
  return {
    title,
    author,
    year,
    status,
    updateDate,
    updateChapter,
    intro,
    allIntro,
    area,
    alias,
    plot,
  };
};
/**
 * 获取到猜你喜欢的漫画
 * @param $
 * @returns
 */
const getLike = ($: CheerioAPI) => {
  const like = $(".book-similar ul li");
  let Like = [];
  like.each(function () {
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
    Like.push({ imgSrc, ttSection, toUrl, name });
  });
  return Like;
};

/**
 * 获取到对应的话,卷,单行本等信息
 * @param $
 * @returns
 */
const getChapter = ($: CheerioAPI) => {
  const chapter = $("#chapter-list-1 ul li");
  const Chapter = [];
  const volume = $("#chapter-list-0 ul li");
  const Volume = [];
  chapter.each(function () {
    // 章节名字
    const chapterName = $(this).find("a").attr("title");
    // 有多少页
    const page = $(this).find("i").text();
    // 跳转地址
    const toUrl = "http://www.manhuagui.com" + $(this).find("a").attr("href");
    Chapter.push({ chapterName, page, toUrl });
  });
  volume.each(function () {
    // 卷名字
    const volumeName = $(this).find("a").attr("title");
    // 有多少页
    const page = $(this).find("i").text();
    // 跳转地址
    const toUrl = "http://www.manhuagui.com" + $(this).find("a").attr("href");
    Volume.push({ volumeName, page, toUrl });
  });
  // 进行排序从小到大
  const sortedChapter = Chapter.sort((a, b) => {
    const numA = parseInt(a.chapterName.replace(/[^0-9]/g, ""), 10) || Infinity;
    const numB = parseInt(b.chapterName.replace(/[^0-9]/g, ""), 10) || Infinity;
    return numA - numB;
  });
  const sortedVolume = Volume.sort((a, b) => {
    const numA = parseInt(a.volumeName.replace(/[^0-9]/g, ""), 10) || Infinity;
    const numB = parseInt(b.volumeName.replace(/[^0-9]/g, ""), 10) || Infinity;
    return numA - numB;
  });
  return {
    sortedChapter,
    sortedVolume,
  };
};
/** 获取到漫画评分 */
const getScore = ($: CheerioAPI) => {
  // 评分
  const scoreNum = $(".score-avg").text();
  // 评分人生
  const scorePeople = $(".score-amo span").text();
  // 评分占比
  const scorePercent: {
    five: string;
    four: string;
    three: string;
    two: string;
    one: string;
  } = {
    five: "",
    four: "",
    three: "",
    two: "",
    one: "",
  };
  $(".score-per p").each(function (i, e) {
    switch (i) {
      case 0:
        scorePercent.five = $(this).text();
        break;
      case 1:
        scorePercent.four = $(this).text();
        break;
      case 2:
        scorePercent.three = $(this).text();
        break;
      case 3:
        scorePercent.two = $(this).text();
        break;
      case 4:
        scorePercent.one = $(this).text();
        break;
      default:
        break;
    }
  });
  return {
    scoreNum,
    scorePeople,
    scorePercent,
  };
};
/** 获取到漫画的章节信息 */
const getInfo = ($: CheerioAPI) => {
  const heand = getheand($);
  const like = getLike($);
  const { sortedChapter: Chapter, sortedVolume: Volume } = getChapter($);
  const score = getScore($);
  return {
    heand,
    like,
    Chapter,
    Volume,
    score,
  };
};
/**
 * 解析查询到的搜索列表的方法
 */
export const getComicsInfo = async ($: CheerioAPI) => {
  const info = getInfo($);
  // 获取到漫画的封面
  const cover = "https:" + $(".hcover img").attr("src");
  return { ...info, cover };
};
