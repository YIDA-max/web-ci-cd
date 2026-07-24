/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-16 14:11:06
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-22 16:44:47
 * @FilePath: /node-koa-mysql/src/utils/File/fileRoot.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import fs from "fs";
import path from "path";
export const getFileRoot: (value?: string) => string = (currentDir) => {
  if (fs.existsSync(path.join(currentDir, "package.json"))) {
    return currentDir;
  }
  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) {
    throw new Error("Could not find root directory");
  }
  return getFileRoot(parentDir);
};
