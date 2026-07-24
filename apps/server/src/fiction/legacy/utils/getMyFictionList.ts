import fs from "fs";
import path from "path";
import { getFileRoot } from '../../../content-shared/utils/File/fileRoot';
import { FICTIONLIST } from "./info";
const novels = [];

const getNovels = (folderPath) => {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && (file.endsWith(".txt") || file.endsWith(".epub"))) {
      novels.push(file);
    } else if (stats.isDirectory()) {
      const subFolderPath = path.join(folderPath, file);
      getNovels(subFolderPath); // 递归调用查询子文件夹中的小说文件
    }
  }
};
/**
 * 查询特定文件夹下面的小说
 */
const queryNovels = (filePate = FICTIONLIST) => {
  // 获取项目的根目录
  const rootPath = getFileRoot(__dirname);
  try {
    const folderPath = path.resolve(rootPath, filePate); // 构建文件夹路径
    fs.mkdirSync(folderPath, { recursive: true });
    novels.length = 0; // 清空之前的查询结果
    getNovels(folderPath); // 调用递归函数查询小说文件
    return {
      code: 200,
      data: novels,
      success: true,
    };
  } catch (error) {
    console.error("Error reading novels:", error);
    return {
      code: 200,
      data: [],
      success: true,
    };
  }
};
export { queryNovels };
