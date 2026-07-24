/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-30 15:40:12
 * @FilePath: /node-koa-mysql/src/routes/Mooncell/homePage.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了,不需要纠结其他的 模仿登录失败,看起来pixiv网站是需要某种密码进行验证才能登录的
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import puppeteer from "puppeteer";
export default async (ctx: RouterContext, next: () => any) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("https://fgo.wiki/w/%E9%A6%96%E9%A1%B5", {
    waitUntil: "networkidle2",
  });
  const content = await page.content();
  browser.close();
  ctx.body = content;
};
