import path from "path";
import fs from "fs";
import Epub from "epub-gen";
const filtersList = (dir, prefix = "") => {
  // 图片文件扩展名列表
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

  // 判断文件是否为图片
  const isImageFile = (file) =>
    imageExtensions.includes(path.extname(file).toLowerCase());

  // 递归地查找目录中的所有图片文件
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const folders = {};
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const key = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      folders[key] = filtersList(fullPath, key);
    } else if (entry.isFile() && isImageFile(entry.name)) {
      folders[key] = fullPath;
    }
  }
  return folders;
  // 使用示例
};
const createEpubFile = async (dir) => {
  const filterObj = filtersList(dir);
  // 转换数据结构
  const content = Object.keys(filterObj)
    .map((item) => {
      return Object.keys(filterObj[item]).map((item2, index) => {
        return {
          title: item + index + "页",
          data: `<img src="${filterObj[item][item2]}" alt="Page image"/>`,
        };
      });
    })
    .flat();
  const option = {
    title: "EPUB Titl1e", // 书籍的标题
    author: "Author Name", // 书籍的作者
    cover: "http://example.com/url/to/cover/image.jpg", // 封面图片的 URL
    version: 3, // EPUB 版本，可以是 2 或 3
    content: content,
  };
  new Epub(
    option,
    "/Users/zhuhansong/Desktop/UGit/node-koa-mysql/comicsList/myEbook.epub"
  ).promise.then(
    () => {
      console.log("Ebook Generated Successfully!");
    },
    (err) => {
      console.error("Failed to generate Ebook because of ", err);
    }
  );
  return content;
};

export { createEpubFile };
