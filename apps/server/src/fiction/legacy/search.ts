/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-19 16:01:02
 * @FilePath: /node-koa-mysql/src/routes/fiction/search.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { getbooksList } from "./utils/getFileBooks";
import iconv from "iconv-lite";
import {
  isListOrPage,
  getHtmlListItems,
  getHtmlPageItems,
} from "./utils/searchUtils";
export default async (ctx: RouterContext, next: () => any) => {
  const keyword = ctx.query.keyword as string;
  const encodedBuffer = iconv.encode(keyword, "GBK");
  const encodedKeyword = Array.prototype.map
    .call(encodedBuffer, (x) => "%" + x.toString(16).toUpperCase())
    .join("");

  const response = await axios(
    `https://www.xbiquge.tw/modules/article/search.php?searchkey=${encodedKeyword}`,
    {
      method: "get",
      responseType: "arraybuffer",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        Host: "www.xbiquge.tw",
        "If-None-Match": "1684226638|",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
    }
  );
  // 使用iconv-lite将GBK数据转换为UTF-8字符串 这个时候的data就是一个html页面了
  const data = iconv.decode(Buffer.from(response.data), "GBK");
  const $ = load(data);
  const isList = isListOrPage($, keyword);
  let list = [];
  switch (isList) {
    case "list":
      list = getHtmlListItems($);
      ctx.body = {
        data: list,
        code: "200",
        success: true,
        html: data,
        url: `https://www.xbiquge.tw/modules/article/search.php?searchkey=${encodedKeyword}`,
      };
      break;
    case "page":
      list = getHtmlPageItems($);
      ctx.body = {
        data: list,
        code: "200",
        success: true,
        html: data,
        url: `https://www.xbiquge.tw/modules/article/search.php?searchkey=${encodedKeyword}`,
      };
      break;
    default:
      ctx.body = {
        data: [],
        code: "200",
        success: true,
        html: data,
        url: `https://www.xbiquge.tw/modules/article/search.php?searchkey=${encodedKeyword}`,
      };
      break;
  }
};
