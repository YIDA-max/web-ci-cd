/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-08 16:47:38
 * @FilePath: /node-koa-mysql/src/routes/comics/comicsTable.ts
 * @Description:漫画推荐搜索列表接口
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { getComicsTablHtml } from "./utils/comicsTable";
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const {
      area,
      tags,
      audience,
      year,
      letter,
      status,
      sort = "update.html",
      current = 1,
      pageSize = 40,
    } = ctx.query || {};
    // 算出现在的第几页
    function calculateTableOffset(page, size) {
      const p = Number(page) || 1;
      const s = Number(size) || 40;
      return Math.floor(((p - 1) * s) / 40) + 1;
    }
    // 定义一个函数，如果存在该属性，就添加“_”
    const constructSegment = (str: string) => (str ? `${str}_` : "");
    // 使用数组和 join() 方法构建 URL
    const segments = [area, tags, audience, year, letter, status]
      .filter(constructSegment) // 过滤掉空字符串
      .join("_"); // 使用 "_" 连接字符串
    const offset = calculateTableOffset(current, pageSize);
    // 如果是第二页或更高页，就去掉末尾的 ".html"
    const isSecondPageOrLater = offset > 1;
    const sortStr = String(sort || "update.html");
    const sortPart = isSecondPageOrLater ? sortStr.slice(0, -5) : sortStr;
    // 是否需要添加/分隔符
    const segmentPart = segments ? "/" : "";
    // 是否需要添加_p确定是第几页
    const offsetPart = isSecondPageOrLater ? `_p${offset}.html` : "";
    const url = `https://www.manhuagui.com/list/${segments}${segmentPart}${sortPart}${offsetPart}`;

    const { data } = await axios.get(url, {
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
    const $ = load(data);
    const { data: info, total } = await getComicsTablHtml($);
    ctx.body = {
      code: 200,
      data: info,
      total,
      success: true,
    };
  } catch (error) {
    console.log("comicsTable error", error);
    ctx.status = 502;
    ctx.body = {
      code: 502,
      data: [],
      total: 0,
      success: false,
      errorMessage: "漫画列表抓取失败",
    };
  }
};
