/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-30 15:38:23
 * @FilePath: /node-koa-mysql/src/routes/comics/comicsDownload.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer";
import {
  getComicsChapter,
  getComicsChapterByArray,
} from "./utils/comicsDownload";
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const urlData = ctx.request.body as { url: string; index?: number };
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto(urlData.url, {
      waitUntil: "networkidle2",
    });
    const content = await page.content();
    const $ = load(content);
    const { sortedChapter, sortedVolume, name } = await getComicsChapter(
      $,
      urlData.index
    );
    await getComicsChapterByArray(sortedVolume, name);
    browser.close();
    ctx.body = {
      code: 200,
      data: {
        sortedChapter,
        sortedVolume,
      },
      success: true,
    };
  } catch (error) {}
};
