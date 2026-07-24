/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-19 14:31:26
 * @FilePath: /node-koa-mysql/src/routes/utilsClass/text.ts
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import path from "path";
import fs from "fs";
const puppeteer = require("puppeteer");
export default async (ctx: RouterContext, next: () => any) => {
  try {
    ctx.body = "content";
  } catch (error) {
    console.log(" ", error);
    ctx.app.emit("error", "1006", ctx);
  }
};
