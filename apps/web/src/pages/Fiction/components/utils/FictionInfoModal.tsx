/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 11:06:57
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 15:32:56
 * @FilePath: /React-Ant/src/pages/Fiction/FictionList/components/utils/FictionInfoModal.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getBookDetail } from '@/api/Fiction/FictionList';
import { Key } from 'react';
interface Irecord {
  id: Key;
  author: string;
  latestChapter: string;
  novelTitle: string;
  tag: string;
  url: string;
}
const useFictionInfo = (record: Irecord) => {
  const getFictionInfo = async () => {
    const { data } = await getBookDetail(record.url);
    return data;
  };
  return { getFictionInfo };
};
export { useFictionInfo };
