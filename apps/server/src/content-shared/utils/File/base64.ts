/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-11 09:46:35
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-11 10:27:48
 * @FilePath: /node-koa-mysql/src/utils/File/base64.ts
 * @Description:class类方法
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
class Base64Encoder {
  constructor() {}
  /**
   * @description: 转换为base64
   * @param response 数据,必须是buffer
   */
  encode(response) {
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const data = {
      base64,
      contentType: response.headers["content-type"],
    };
    return data;
  }
}
export const base64Encoder = new Base64Encoder();
