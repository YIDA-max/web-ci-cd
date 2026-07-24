/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-05 15:40:01
 * @FilePath: /node-koa-mysql/src/routes/comics/getComicList.ts
 * @Description: 获取漫画列表
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { getHtmlInfo } from "./utils/getComicList";
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const { data } = await axios.get("https://www.manhuagui.com/", {
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
    const info = await getHtmlInfo($);
    ctx.body = {
      code: 200,
      data: info,
      success: true,
    };
  } catch (error) {
    console.log(" ", error);
    ctx.app.emit("error", "1006", ctx);
  }
};
