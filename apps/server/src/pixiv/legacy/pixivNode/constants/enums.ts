/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-29 12:18:22
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-30 10:26:12
 * @FilePath: /node-koa-mysql/src/routes/pixiv/pixivNode/constants/enums.ts
 * @Description: 枚举
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export namespace enums {
  /**
   * Type of content returned by Pixiv
   * ILLUSTRATION 表示插画类型的内容；
   * MANGA 表示漫画类型的内容；
   * UGOIRA 表示动图类型的内容；
   * NOVEL 表示小说类型的内容。
   */
  export const CONTENT_TYPE = {
    ILLUSTRATION: "illust",
    MANGA: "manga",
    UGOIRA: "ugoira",
    NOVEL: "novel",
  };
  /**
   * Max age of returned content
   */
  export const DURATION = {
    LAST_DAY: "last_day",
    LAST_WEEK: "last_week",
    LAST_MONTH: "last_month",
  };
  /**
   * Period of ranking
   */
  export const RANKING_MODE = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    DAY_MALE: "day_male",
    DAY_FEMALE: "day_female",
    WEEK_ORIGINAL: "week_original",
    WEEK_ROOKIE: "week_rookie",
    DAY_MANGA: "day_manga",
  };
  /**
   * Search option
   * - Match option of tags or search for title
   */
  export const SEARCH_TARGET = {
    TAGS_PARTIAL: "partial_match_for_tags",
    TAGS_EXACT: "exact_match_for_tags",
    TITLE_AND_CAPTION: "title_and_caption",
  };
  /**
   * Different size of returned image
   */
  export const SIZE = {
    LARGE: "large",
    MEDIUM: "medium",
    ORIGINAL: "original",
    SQUARE_MEDIUM: "square_medium",
  };
  /**
   * Sort method of returned contents
   */
  export const SORT = {
    DATE_DESC: "date_desc",
    DATE_ASC: "date_asc",
    MALE_DESC: "popular_male_desc",
    FEMALE_DESC: "popular_female_desc",
    POPULAR_DESC: "popular_desc",
  };
  /**
   * Visibility of certain user feature (bookmark, etc.)
   */
  export const VISIBILITY = {
    PUBLIC: "public",
    PRIVATE: "private",
  };

  export const FILTER = "for_ios";
  export const AUTH_URL = "https://oauth.secure.pixiv.net/auth/token";
  export const API_BASE_URL = "https://app-api.pixiv.net";
  export const USER_AGENT = "PixivAndroidApp/5.0.234 (Android 11; Pixel 5)";
  export const CLIENT_ID = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
  export const CLIENT_SECRET = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";

  export var ACCEPT_LANGUAGE: "zh-cn" | "zh-tw" | "en-us" | "ja-jp" | "ko-kr" =
    "en-us";
}
