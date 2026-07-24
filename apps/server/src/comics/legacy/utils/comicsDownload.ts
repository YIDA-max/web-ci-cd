// @ts-nocheck
/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-16 16:39:34
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-21 10:54:21
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/comicsDownload.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import fs from "fs";
import path from "path";
import { getFileRoot } from '../../../content-shared/utils/File/fileRoot';
/**
 * 传入html返回解析的全部的漫画章节或者卷
 */
const getComicsChapter = ($: CheerioAPI, index = 0) => {
  const chapter = $("#chapter-list-1 ul li");
  const Chapter = [];
  const volume = $(".chapter-list").eq(index).find("ul li");
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
  // 获取名字
  const name = $(".book-title h1").text();
  return {
    sortedChapter,
    sortedVolume,
    name,
  };
};

/** 获取到对应漫画的具体图片函数,返回的buffer */
export const reqItemImg = async (
  path,
  hostname = "i.hamreus.com",
  port = 443
) => {
  const response = await axios.get(`https://${hostname}:${port}${path}`, {
    headers: {
      Accept: "image/webp,image/*,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, sdch",
      "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Host: "i.hamreus.com:8080",
      Pragma: "no-cache",
      Referer: "http://www.manhuagui.com/comic/5546/51102.html",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
    },
    responseType: "arraybuffer",
  });
  return response.data;
};
/** 解析html所必要的函数 */
export const parse = (p, a, c, k, e, d) => {
  e = function (c) {
    return (
      (c < a ? "" : e(parseInt(((c as number) / a) as unknown as string))) +
      ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    );
  };
  if (!"".replace(/^/, String)) {
    while (c--) d[e(c)] = k[c] || e(c);
    k = [
      function (e) {
        return d[e];
      },
    ];
    e = function () {
      return "\\w+";
    };
    c = 1;
  }
  while (c--)
    if (k[c]) p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
  return p;
};
/**
 *
 * @param item 某一话的html
 * @returns 参数是具体要解析的某一户的html,返回的是这一话或者这一卷的具体的info,可以拿里面的值去进行下载
 */
export const useItemInfo = async (item) => {
  let info;
  String(item).replace(/p;}\((.*?),\{\}/im, ($0) => {
    let t = $0.substr(4);
    let s = eval(`[${t}]`);
    let d = parse.apply(this, s);
    info = JSON.parse(d.split("(")[1].split(")")[0]);
    return "cInfo";
  });
  return info;
};
/**
 * 传入数组,直接解析下载对应的漫画
 */
const getComicsChapterByArray = async (
  arr: {
    cname: string;
    toUrl: string;
  }[],
  name
) => {
  const rootPath = getFileRoot(__dirname);
  const dir = path.join(rootPath, "comicsList", name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  while (arr.length) {
    try {
      const item = arr.shift();
      const { data } = await axios.get(item.toUrl, {
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
      const info = await useItemInfo(data);
      console.log("解析该话完毕", info.cname);
      const subdir = path.join(dir, info.cname);
      if (!fs.existsSync(subdir)) {
        fs.mkdirSync(subdir, { recursive: true }); // 修改这里
      }
      // 等待1秒
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 1000);
      });
      while (info.files.length) {
        try {
          const file = info.files.shift();
          const bufferImg = await reqItemImg(
            encodeURI(`${info.path}/${file}?cid=${info.cid}&md5=${info.sl.m}`)
          );
          console.log("解析这张图片完毕 ", file);
          const imgPath = path.join(subdir, file);
          fs.writeFileSync(imgPath, bufferImg);
          console.log("图片保存完毕", imgPath);
          // 等待0.1秒
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(1);
            }, 500);
          });
        } catch (error) {
          console.log(" 解析某一张图片出错了", error);
        }
      }
    } catch (error) {
      console.log("解析某一章,出错了", error);
    }
  }
  return {
    success: true,
  };
};
export { getComicsChapter, getComicsChapterByArray };
