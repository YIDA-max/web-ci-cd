/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-01 16:46:10
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-15 11:27:07
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/getComicsImg.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
let hamreusHeaders = {
  Accept: "image/webp,image/*,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, sdch",
  "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Host: "i.hamreus.com:8080",
  Pragma: "no-cache",
  Referer: "http://www.manhuagui.com/comic/5546/51102.html",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
};
/** 获取到对应漫画的具体图片函数,返回的buffer */
export const reqItemImg = async (
  path,
  hostname = "i.hamreus.com",
  port = 443,
  headers = hamreusHeaders
) => {
  const response = await axios.get(`https://${hostname}:${port}${path}`, {
    headers: {
      ...headers,
    },
    responseType: "arraybuffer",
  });
  return response.data;
};
