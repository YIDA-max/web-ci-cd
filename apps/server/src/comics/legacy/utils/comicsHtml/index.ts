/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-01 16:46:10
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-02 16:17:52
 * @FilePath: /node-koa-mysql/src/routes/comics/utils/comicsHtml/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import axios from "axios";
const LZString = require("./lzs.js");
const fs = require("fs");
const path = require("path");
// 定义新方法的接口
interface String {
  splic(f: string): string[];
}
// 在全局的String接口上添加新方法
declare global {
  interface String {
    splic(f: string): string[];
  }
}
// 实现新方法
String.prototype.splic = function (f: String) {
  return LZString.decompressFromBase64(this).split(f);
};
const cfg = {
  comicID: 26886, //下载漫画的ID，比如下载的地址是http://www.manhuagui.com/comic/26886/，则comicID为26886
  downloadDir: "download", //下载文件夹
  timeout: 3000, //下载间隔，值太小请求太多容易超时，太大则下载会慢，根据自己情况调整
};
let manhuaguiHeaders = {
  "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Cookie: "country=CN",
  Host: "www.manhuagui.com",
  Pragma: "no-cache",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
};
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
// 获取到对应漫画的全部章节的函数
export const req = async (
  path,
  hostname = "www.manhuagui.com",
  port = 443,
  headers = manhuaguiHeaders
) => {
  let obj = {
    vol: [],
    urls: [],
    title: "",
  };
  try {
    const response = await axios.get(`https://${hostname}:${port}${path}`, {
      headers,
    });
    response.data.replace(/<title>(.*?) - 看漫画/, (...args) => {
      try {
        obj.title = args[1];
        // 这里是漫画的名字
      } catch (error) {
        // console.log(error);
      }
    });
    response.data.replace(/<\/span><\/h4>.*?comment mt10/im, (list) => {
      list.match(/<a href="(.*?)" title="(.*?)"/gim).forEach((value, index) => {
        value.replace(
          /href="(\/comic\/\d+\/\d+\.html)" title="(.*?)"/im,
          (...args) => {
            obj.vol[index] = {
              link: args[1],
              title: args[2],
            };
            if (args[1]) {
              obj.urls[index] = args[1];
            }
            try {
            } catch (error) {
              // console.log(error);
            }
          }
        );
      });
    });
    return obj;
  } catch (error) {
    throw error;
  }
};
// 获取到对应漫画的具体章节函数
export const reqItem = async (
  path,
  hostname = "www.manhuagui.com",
  port = 443,
  headers = manhuaguiHeaders
) => {
  const response = await axios.get(`https://${hostname}:${port}${path}`, {
    headers,
  });
  return response.data;
};
// 获取到对应漫画的具体图片函数
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
// 自定义解析具体章节的内容
export const parse = (p, a, c, k, e, d) => {
  e = function (c) {
    return (
      (c < a ? "" : e(parseInt(((c as number) / a) as unknown as string))) +
      ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    );
  };
  if (!"".replace(/^/, String)) {
    while (c--) d[e(c)] = k[c] || e(c);
    k = [
      function (e) {
        return d[e];
      },
    ];
    e = function () {
      return "\\w+";
    };
    c = 1;
  }
  while (c--)
    if (k[c]) p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
  return p;
};
export const useImg = async () => {
  const { vol, urls } = await req("/comic/" + cfg.comicID + "/");
  // 这里是解析到具体的漫画的章节的urls 需要有一定的间隔去发送请求
  const itemHtml = [];
  while (urls.length) {
    const url = urls.shift();
    const data = await reqItem(url);
    itemHtml.push({
      html: data,
      index: urls.length,
    });
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
  }
  // 这个info中是解析的所有的参数info
  const cInfo: Array<{
    files: Array<string>;
    path: string;
    sl: {
      m: string;
      e: number;
    };
    cid: number;
  }> = [];
  while (itemHtml.length) {
    const item = itemHtml.shift().html;
    String(item).replace(/p;}\((.*?),\{\}/im, ($0) => {
      let t = $0.substr(4);
      let s = eval(`[${t}]`);
      let d = parse.apply(this, s);
      cInfo.push(JSON.parse(d.split("(")[1].split(")")[0]));
      return "cInfo";
    });
  }
  // 这个是具体的某个漫画章节, 每一话;
  while (cInfo.length) {
    const info = cInfo.shift();
    info.files.length = 2;
    // 这个是具体的某一话中的具体的某一张图片
    while (info.files.length) {
      const file = info.files.shift();
      // 在这里获取到具体的某一张图片的buffer
      const bufferImg = await reqItemImg(
        encodeURI(`${info.path}/${file}?cid=${info.cid}&md5=${info.sl.m}`)
      );
    }
  }
  return cInfo;
};
// /**
//  *
//  * @param id 漫画的id
//  * 给某个漫画的id返回具体的全部的卷或者话的info
//  */
// export const useComicInfos = async (id) => {
//   const { vol, urls, title } = await req("/comic/" + id + "/");
//   // 这里是解析到具体的漫画的章节的urls 需要有一定的间隔去发送请求
//   const comicInfo = [];
//   while (urls.length) {
//     const url = urls.shift();
//     // 这里是解析到具体的漫画的章节的html,就是每一话的html,里面可能有很多的图片
//     const data = await reqItem(url);
//     comicInfo.push({
//       html: data,
//       index: urls.length,
//       title,
//       vol: vol[urls.length],
//     });
//     await new Promise((resolve) => {
//       setTimeout(resolve);
//     });
//   }
//   return comicInfo;
// };

/**
 *
 * @param item 某一话的html
 * @returns 参数是具体要解析的某一户的html,返回的是这一话或者这一卷的具体的info,可以拿里面的值去进行下载
 */

export const useItemInfo = async (item) => {
  let info;
  String(item).replace(/p;}\((.*?),\{\}/im, ($0) => {
    let t = $0.substr(4);
    let s = eval(`[${t}]`);
    let d = parse.apply(this, s);
    info = JSON.parse(d.split("(")[1].split(")")[0]);
    return "cInfo";
  });
  return info;
};
