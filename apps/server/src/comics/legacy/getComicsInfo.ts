/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-30 15:38:08
 * @FilePath: /node-koa-mysql/src/routes/comics/getComicsInfo.ts
 * @Description: 获取漫画列表
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { getComicsInfo } from "./utils/getComicsInfo";
const puppeteer = require("puppeteer");
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const { toUrl } = ctx.request.body as { toUrl: string };
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(toUrl, {
      waitUntil: "networkidle2",
    });
    const content = await page.content();
    const $ = load(content);
    const info = await getComicsInfo($);
    browser.close();
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
