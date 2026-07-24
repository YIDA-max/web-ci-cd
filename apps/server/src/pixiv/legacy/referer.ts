/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-24 14:55:54
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-31 11:29:19
 * @FilePath: /node-koa-mysql/src/routes/pixiv/referer.ts
 * @Description在这个文件我们只需要写业务逻辑中间件就可以了
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RouterContext } from '../../content-shared/router-context';
import axios from "axios";
import { downImg } from '../../content-shared/utils/File/down';
import { base64Encoder } from '../../content-shared/utils/File/base64';
export default async (
  ctx:
    | RouterContext & {
        request: {
          body: {
            url: string;
          };
        };
      },
  next: () => any
) => {
  const { url } = ctx.request.body;
  const name = url.split("/").pop(); // 获取图片名称，与原代码类似
  const fileType = url.split(".").pop(); // 获取图片名称，与原代码类似
  // 因为浏览器无法自定义Referer,所以我们需要后端进行请求处理
  const response = await axios.get(url, {
    headers: { Referer: "https://app-api.pixiv.net/" },
    responseType: "arraybuffer", // ! 这里一定要设置,因为我们要像服务器说明我们要怎么样的数据,stream说明是直接返回一个可读文件 ,arraybuffer说明是一个二进制数组
  });
  // 保存图片
  downImg.saveImg(fileType, response, name);
  // 返回数据
  const data = base64Encoder.encode(response);
  ctx.body = data;
};
