/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-09 20:44:57
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-10 10:10:24
 * @FilePath: /node-koa-mysql/src/routes/01BZ/utils/text.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
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
import { CheerioAPI, load } from "cheerio";
const fs = require("fs");
/** 确认自己是是不是最后一页 */
const chapterPagescurr = async ($: CheerioAPI, page, url) => {
  const title = $(".page-title").text();
  let text = "";
  const fn = async ($: CheerioAPI) => {
    // 打印当前章节
    const currentChapter = $(".chapterPages .curr").text().replace(/\D/g, "");
    console.log("当前节：", currentChapter);
    // 获取文本内容
    const content = $(".neirong").text();
    text += content;
    // 当前节的内容
    // console.log(" ", content);
    // 检查是否存在下一节
    const isLastChapter = $(".chapterPages .curr").next().length > 0;
    if (isLastChapter) {
      console.log("检查是否存在下一节", isLastChapter);
      // 使用正则表达式移除非数字字符
      let cleanedStr = $(".chapterPages .curr")
        .next()
        .text()
        .replace(/\D/g, "");
      console.log("下一节是", cleanedStr);
      // 将清理过的字符串转换为数字
      let num = parseInt(cleanedStr);
      let parts = url.split("_"); // 按照'_'来分割字符串
      let newUrl; // 用来存储新的url
      if (parts.length > 1) {
        // 移除最后一个元素 如果大与1就说明有_
        parts.pop();
        // 重新拼接字符串
        newUrl = parts.join("_"); // 使用'_'将分割后的字符串重新组合起来
      } else {
        newUrl = parts[0].replace(/\.html$/, ""); // 如果没有'_'就说明是第一页 去除.html
      }
      console.log("下一节url是", newUrl + "_" + num + ".html");

      await page.goto(newUrl + "_" + num + ".html", {
        waitUntil: "networkidle2",
      });
      const contentNext = await page.content();
      const $next = load(contentNext);
      await fn($next); // to this
    } else {
      return;
    }
  };
  await fn($);
  return {
    title,
    text,
  };
};
/**
 * 主方法
 */
export const text = async ($: CheerioAPI, page, url, name) => {
  let writeStream = fs.createWriteStream(`${name}.txt`, { flags: "a" });
  let writeStreaminfo = fs.createWriteStream(`${name}Info.txt`, { flags: "a" });
  const fn = async ($: CheerioAPI, url) => {
    if ($(".next").attr("href")) {
      let { title, text } = await chapterPagescurr($, page, url);
      // 去除乱码
      text = text.replace(/[╜▼╰苐§◥↑◢╚]/g, "");
      text = text.replace(/[?地?址□搜ㄨ一¨版?主μ综ˉ合⊿社ζ区μ]/g, "");
      text = text.replace(/[`ww`w点01^b`z点n"et"]/g, "");
      text = text.replace(/[Δ寻回∴网|∵百度3◤◎3∵∷]/g, "");
      text = text.replace(/[╘最☆新∷网☆百度╙◇↓╘#╛∴]/g, "");
      text = text.replace(/[╖最╕新3网╗百度╔╗↓Δ3∷，]/g, "");
      text = text.replace(/[╖最╕新3网╗百度]/g, "");
      text = text.replace(/[△找请ˇ╮索★△ˇ△]/g, "");
      text = text.replace(/[△╒╮╮◣∶◣]/g, "");
      text = text.replace(/[╝◆╝ξ▲╝2▽]/g, "");
      text = text.replace(/[ˇ△╮○○]/g, "");
      text = text.replace(/[`");]/g, "");
      text = text.replace(/[(']/g, "");
      text = text.replace(/[`");]/g, "");
      text = text.replace(/[◆╓°]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[×●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[●]/g, "");
      text = text.replace(/[]/g, ""); // 去除特定字符
      // 遇到空格就换行
      text = text.replace(/　　/g, "　　\n　　");
      // 替换所有单独占一行的空格
      text = text.replace(/^\s+$/gm, "");
      // 写入文件
      writeStream.write(`\n\n${title}`, "utf8");
      writeStream.write(`${text}`, "utf8");
      writeStreaminfo.write(`${title}\n`, "utf8");
      writeStreaminfo.write(
        url.split("/").slice(0, 3).join("/") + "/" + $(".next").attr("href"),
        "utf8"
      );
      console.log(
        "下章是",
        url.split("/").slice(0, 3).join("/") + "/" + $(".next").attr("href")
      );
      await page.goto(
        url.split("/").slice(0, 3).join("/") + "/" + $(".next").attr("href"),
        {
          waitUntil: "networkidle2",
        }
      );
      const content = await page.content();
      const $next = load(content);
      console.log(
        " ",
        $(".page-title").text() + $(".chapterPages a.curr").attr("href")
      );
      await fn(
        $next,
        url.split("/").slice(0, 3).join("/") + "/" + $(".next").attr("href")
      ); // to this
    } else {
      return;
    }
  };
  await fn($, url);
  return {};
};
