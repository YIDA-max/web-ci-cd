/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 11:06:57
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 11:22:58
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicsInfo/utils/ComicsInfoModal.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getBookDetail } from '@/api/Fiction/FictionList';
const useFictionInfo = (toUrl: string) => {
  const getFictionInfo = async () => {
    const { data } = await getBookDetail(toUrl);
    return data;
  };
  return { getFictionInfo };
};
export { useFictionInfo };
