/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-31 09:42:39
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-31 09:43:19
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/BookContent/types/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
interface IndexProps {
  FictionItemName: string;
  callback: (value: {
    data: string;
    title: string;
    nextTitle: string;
    prevTitle: string;
    nextId: string;
    prevId: string;
    filename: string;
    index?: number;
    FictionItemInfo?: any;
  }) => void;
}
interface IFictionItemInfo {
  toc: Array<{
    href: string;
    id: string;
    level: number;
    'media-type': string;
    order: number;
    title: string;
  }>;
  title: string;
  date: string;
  creator: string;
  filename: string;
}
export type { IndexProps, IFictionItemInfo };
