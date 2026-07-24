/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-15 14:31:42
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-15 14:35:30
 * @FilePath: /React-Ant/src/pages/comics/comicsView/types/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
interface IInfo {
  bid: number;
  bname: string;
  bpic: string;
  cid: number;
  cname: string;
  file: string;
  finished: boolean;
  len: number;
  path: string;
  status: number;
  block_cc?: string;
  nextId: number;
  prevId: number;
  files: Array<string>;
  sl: {
    e: number;
    m: string;
  };
}
export { IInfo };
