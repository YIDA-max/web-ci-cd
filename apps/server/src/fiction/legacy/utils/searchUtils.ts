import { CheerioAPI } from "cheerio";
import { load } from "cheerio";
/**
 * 判断是否是列表还是具体的页面
 */
const isListOrPage = ($: CheerioAPI, keyword: string) => {
  let title = $("title").first().text();
  // 检查标题中是否包含关键字
  if (title.includes("搜索结果")) {
    console.log("有搜索结果就说明是list");
    return "list";
  } else {
    console.log("说明找到了具体的结果");
    return "page";
  }
};

/**
 * 当发现是列表的时候，就需要进行解析
 */
const getHtmlListItems = ($: CheerioAPI) => {
  const infoList = [];
  const lis = $("#main li"); // 获取id为main的div下所有的li元素
  lis.each(function (i, elem) {
    const info: {
      tag: string;
      novelTitle: string;
      url: string;
      latestChapter: string;
      author: string;
    } = {
      tag: "",
      novelTitle: "",
      url: "",
      latestChapter: "",
      author: "",
    };
    // 获取每个li下的所有span标签的内容
    // 获取到所有的tag标签
    const tag = $(this).find("span").eq(0).text().replace(/\[|\]/g, "");
    info.tag = tag;
    // 获取到所有的小说标题
    const novelTitle = $(this).find("a").eq(0).text();
    info.novelTitle = novelTitle;
    // 获取到所有的小说url
    const url = $(this).find("a").eq(0).attr("href");
    info.url = url;
    // 获取到所有的小说的最新章节
    const latestChapter = $(this).find("a").eq(1).text();
    info.latestChapter = latestChapter;
    // 获取到所有的小说的作者
    const author = $(this).find("span").eq(3).text();
    info.author = author;
    infoList.push(info);
  });
  return infoList;
};
/**
 * 当发现单独的页面的时候的时候，组织数据进行返回
 */
const getHtmlPageItems = ($: CheerioAPI) => {
  const info = $("#info"); // 获取id为main的div下所有的li元素
  const url = $("link").eq(0).attr("href");
  return [
    {
      tag: info.find("p").eq(0).text().replace(/\[|\]/g, ""),
      novelTitle: $("div#info h1").text(),
      url,
      latestChapter: $("div#info p a").eq(4).text(),
      author: $("div#info p a").eq(0).text(),
    },
  ];
};
export { isListOrPage, getHtmlListItems, getHtmlPageItems };
