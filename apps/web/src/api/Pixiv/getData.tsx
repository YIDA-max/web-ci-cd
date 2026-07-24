/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 10:48:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-01 10:10:46
 * @FilePath: /React-Ant/src/api/Pixiv/getData.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { request } from '@/utils/request';
interface Illustration {
  key: number;
  id: number;
  title: string;
  type: 'illust' | 'manga' | 'ugoira' | 'novel';
  caption: string;
  restrict: 0 | 1 | 2;
  user: {
    uid: number;
    name: string;
    account: string;
  };
  tags: {
    name: string;
    translated_name: string | null;
  }[];
  create_date: string;
  page_count: number;
  sanity_level: 1 | 2 | 3 | 4 | 5 | 6;
  x_restrict: 0 | 1;
  is_bookmarked: boolean;
  total_bookmarks: number;
  total_view: number;
  image_urls: {
    square_medium: string;
    medium: string;
    large: string;
  };
  meta_single_page: {
    original_image_url: string;
  };
  meta_pages: never[];
}
/**
 * 获取推荐列表的数据
 */
export const Recommend = (
  loginInfo: {
    access_token: string;
    refresh_token: string;
    expire_time: number;
    user: any;
  },
  queryParameter: {
    contentType?: 'ILLUSTRATION' | 'MANGA' | 'UGOIRA' | 'NOVEL';
    includeRankingIllustration: 'false' | 'true';
    maxBookmarkIDForRecommend?: number;
    minBookmarkIDForRecentIllustrations?: number;
    offset?: number;
    bookmarkIllustIDs?: Array<number> | any;
    includeRankingLabel: 'false' | 'true';
  } = {
    contentType: 'ILLUSTRATION',
    includeRankingIllustration: 'true',
    includeRankingLabel: 'true',
  },
) => {
  return request<{ data: Array<Illustration> }>('/pixiv/recommend', {
    method: 'POST',
    data: {
      loginInfo,
      queryParameter,
    },
  });
};
/**
 * 获取可以查看的图片信息
 */
export const Referer = (url: string) => {
  return request<{
    base64: string;
  }>('/pixiv/referer', {
    method: 'POST',
    data: {
      url,
    },
  });
};
