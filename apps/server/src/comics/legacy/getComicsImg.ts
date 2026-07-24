/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-15 15:01:17
 * @FilePath: /node-koa-mysql/src/routes/comics/getComicsImg.ts
 * @Description: 获取漫画列表
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { load } from "cheerio";
import { reqItemImg } from "./utils/getComicsImg";
interface IInfo {
  bid: number;
  bname: string;
  bpic: string;
  cid: number;
  cname: string;
  file: string;
  finished: boolean;
  len: number;
  path: string;
  status: number;
  block_cc?: string;
  nextId: number;
  prevId: number;
  sl: {
    e: number;
    m: string;
  };
}
export default async (ctx: RouterContext, next: () => any) => {
  try {
    const info = ctx.request.body as IInfo;
    // 在这里获取到具体的某一张图片的buffer
    const bufferImg = await reqItemImg(
      encodeURI(`${info.path}/${info.file}?cid=${info.cid}&md5=${info.sl.m}`)
    );
    // 转换为 Uint8Array
    const uint8Array = new Uint8Array(bufferImg);
    // 转换为 Base64 字符串
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64Image = Buffer.from(binary, "binary").toString("base64");
    // 返回 Base64 编码的图片
    ctx.body = {
      data: `data:image/jpeg;base64,${base64Image}`,
      code: 200,
      success: true,
    };
  } catch (error) {
    console.log(" ", error);
    ctx.app.emit("error", "1006", ctx);
  }
};
