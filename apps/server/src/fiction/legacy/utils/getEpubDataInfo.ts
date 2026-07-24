/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-29 17:47:55
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-30 10:20:29
 * @FilePath: /node-koa-mysql/src/routes/fiction/utils/getEpubDataInfo.ts
 * @Description:  获取到对应的小说具体某一章的内容接口
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import path from "path";
const fs = require("fs");
const unzipper = require("unzipper");
// 使用 Promise 包装获取章节内容的操作
export const getChapterContent = async (epub, chapterId, filePath) => {
  // 一个获取到对应的图片的 base64 编码的方法 如果这个图片是在image或者images文件夹下面的话
  const promiseFsBase64 = (imageFileName = "vol-007338.jpg", filePath) => {
    return new Promise(async (resolve) => {
      // 读取 EPUB 文件 filePath是文件路径
      const epubBuffer = fs.readFileSync(filePath);
      // 解压 EPUB 文件
      const archive = await unzipper.Open.buffer(epubBuffer);
      // 寻找对应的图片的方法 ,支持大部分文件,并且遍历全部的文件夹
      const findImagesInEPub = (entries, imageFileName = "") => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]; // 支持的图片文件格式
        for (const entry of entries) {
          if (entry.type === "File") {
            const ext = path.extname(entry.path).toLowerCase();
            if (
              imageExtensions.includes(ext) &&
              path.basename(entry.path) === imageFileName
            ) {
              return entry;
            }
          } else if (entry.type === "directory") {
            const subFolderEntries = entries.filter(
              (e) => e.path.startsWith(entry.path) && e.path !== entry.path
            );
            const imageEntry = findImagesInEPub(
              subFolderEntries,
              imageFileName
            );
            if (imageEntry) {
              return imageEntry;
            }
          }
        }
        return null;
      };
      // 获取到对应图片的路径
      const imageEntry = findImagesInEPub(archive.files, imageFileName);
      // 如果存在就开始读取文件
      if (imageEntry) {
        const chunks = [];
        imageEntry
          .stream()
          .on("data", (chunk) => chunks.push(chunk))
          .on("end", () => {
            // 在读取完毕之后，将 Buffer 转换为 base64 编码的字符串
            const imageData = Buffer.concat(chunks);
            const base64Image = imageData.toString("base64");
            resolve(base64Image);
          });
      } else {
        resolve("");
        console.error("Target image not found.");
      }
    });
  };
  // 获取提前到全部的图片src 并且转换为base64
  const extractImageBase64 = async (str) => {
    // 匹配<img>标签中的src属性
    const regex = /<img.*?src="(.*?)"/g;
    // 获取到所有的匹配的结果
    const matches = str.matchAll(regex);
    // 中间件暂时保存
    let result = str;
    // 遍历所有的匹配结果
    for (const match of matches) {
      if (match && match.length > 1) {
        const src = match[1];
        // 图片的名称
        const imageFileName = src.split("/").pop();
        // 图片的后缀
        const suffix = imageFileName.split(".").pop();
        // 获取到对应的图片的 base64 编码
        const base64 = await promiseFsBase64(imageFileName, filePath);
        // 替换 img 标签的 src 属性为 base64 数据
        result = result.replace(src, `data:image/${suffix};base64,${base64}`);
      }
    }
    return result;
  };
  // 获取到对应的图片地址的方法
  const getImgSrc = (epub, chapterId) => {
    return new Promise((resolve, reject) => {
      epub.getChapterRaw(chapterId, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const s1 = await extractImageBase64(data);
          resolve(s1);
        }
      });
    });
  };
  return await getImgSrc(epub, chapterId);
};
