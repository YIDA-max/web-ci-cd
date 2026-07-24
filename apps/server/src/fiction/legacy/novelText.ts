/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-05 11:01:28
 * @FilePath: /node-koa-mysql/src/routes/fiction/novelText.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了,不需要纠结其他的 模仿登录失败,看起来pixiv网站是需要某种密码进行验证才能登录的
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import iconv from "iconv-lite";
import { getBooksText } from "./utils/getBooksText";
import { load } from "cheerio";
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const { url } = ctx.request.body as { url: string };
    const response = await axios(url, {
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
    });
    // 使用iconv-lite将GBK数据转换为UTF-8字符串 这个时候的data就是一个html页面了
    const data = iconv.decode(Buffer.from(response.data), "GBK");
    const $ = load(data);
    const info = getBooksText($, url);
    // 在这里发起请求进行pixiv的登录
    ctx.body = {
      code: 200,
      data: info,
      success: true,
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      data: error,
      success: false,
    };
  }
};
