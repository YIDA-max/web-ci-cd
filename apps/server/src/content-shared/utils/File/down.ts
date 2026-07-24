/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-11 09:46:35
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-11 10:30:20
 * @FilePath: /node-koa-mysql/src/utils/File/down.ts
 * @Description:class类方法
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const fs = require("fs");
import path from "path";
class DownImg {
  constructor() {}
  // 向上递归寻找package.json文件
  /**
   * @description: 向上递归寻找package.json文件
   * @param currentDir 当前目录
   */
  findRoot(currentDir) {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error("Could not find root directory");
    }
    return this.findRoot(parentDir);
  }
  /**
   * @description: 保存图片
   * @param fileType 文件类型
   * @param response 请求返回的数据
   * @param name 文件名
   */
  saveImg(fileType, response, name = "test", paperFile = "images") {
    // 这个就是我们的项目根目录
    const projectRoot = this.findRoot(__dirname);
    // 如果没有images目录,就创建一个
    const imagesDir = path.join(projectRoot, paperFile);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }
    // 现在你可以将图片保存在imagesDir目录中了
    const filePath = path.join(imagesDir, name + "." + fileType);
    fs.writeFileSync(filePath, response.data);
  }
}
export const downImg = new DownImg();
