/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-12 11:33:37
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 17:24:27
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicsInfo/types/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
interface IInfo {
  heand: {
    title: string;
    author: string;
    year: string;
    status: string;
    updateDate: string;
    updateChapter: string;
    intro: string;
    allIntro: string;
    area: string;
    alias: string;
    plot: string;
  };
  like: Array<{
    name: string;
    toUrl: string;
    ttSection: string;
    imgSrc: string;
  }>;
  Chapter: Array<{
    chapterName: string;
    page: string;
    toUrl: string;
  }>;
  Volume: Array<{
    volumeName: string;
    page: string;
    toUrl: string;
  }>;
  score: {
    scoreNum: string;
    scorePeople: string;
    scorePercent: {
      five: string;
      four: string;
      three: string;
      two: string;
      one: string;
    };
  };
  cover: string;
  toUrl?: string;
}
interface Illustration {
  toUrl: string;
  name: string;
}

export { IInfo, Illustration };
