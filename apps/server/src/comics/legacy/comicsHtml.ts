/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-02 16:41:09
 * @FilePath: /node-koa-mysql/src/routes/comics/comicsHtml.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了,不需要纠结其他的 模仿登录失败,看起来pixiv网站是需要某种密码进行验证才能登录的
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { reqItemImg, useItemInfo } from "./utils/comicsHtml/index";
export default async (ctx: RouterContext, next: () => any) => {
  const { data } = await axios.get(
    "https://www.manhuagui.com/comic/28905/668327.html",
    {
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
    }
  );
  const info = await useItemInfo(data);
  const bufferImg = await reqItemImg(
    encodeURI(
      `${info.path}/${info.files[122]}?cid=${info.cid}&md5=${info.sl.m}`
    )
  );
  ctx.set("Content-Type", "image/jpeg");
  ctx.body = bufferImg;
};
