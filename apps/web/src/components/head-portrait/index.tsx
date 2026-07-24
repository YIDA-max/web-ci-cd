/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-25 16:07:20
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-25 16:36:26
 * @FilePath: /React-Ant/src/components/head-portrait/index.tsx
 * @Description
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export const getAssetsFile = () => {
  return new URL(`./head-portrait.jpeg`, import.meta.url).href;
};
