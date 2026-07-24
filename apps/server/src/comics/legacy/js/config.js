/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2018-04-25 16:57:10
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-01 15:35:10
 * @FilePath: /node-koa-mysql/src/routes/comics/js/config.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  comicID: 30252, //下载漫画的ID，比如下载的地址是http://www.manhuagui.com/comic/26886/，则comicID为26886
  downloadDir: "download", //下载文件夹
  timeout: 3000, //下载间隔，值太小请求太多容易超时，太大则下载会慢，根据自己情况调整
};
