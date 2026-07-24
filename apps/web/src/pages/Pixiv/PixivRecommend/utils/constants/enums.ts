/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:14:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 10:50:52
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/constants/enums.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const enums = {
  /**
   * Pixiv 返回的内容类型
   */
  CONTENT_TYPE: {
    ILLUSTRATION: 'illust', // 插画
    MANGA: 'manga', // 漫画
    UGOIRA: 'ugoira', // 动图
    NOVEL: 'novel', // 小说
  },
  /**
   * 返回的内容的最大时效性
   */
  DURATION: {
    LAST_DAY: 'last_day', // 最近一天
    LAST_WEEK: 'last_week', // 最近一周
    LAST_MONTH: 'last_month', // 最近一个月
  },
  /**
   * 排名的时间段
   */
  RANKING_MODE: {
    DAY: 'day', // 日榜
    WEEK: 'week', // 周榜
    MONTH: 'month', // 月榜
    DAY_MALE: 'day_male', // 男性日榜
    DAY_FEMALE: 'day_female', // 女性日榜
    WEEK_ORIGINAL: 'week_original', // 原创周榜
    WEEK_ROOKIE: 'week_rookie', // 新人周榜
    DAY_MANGA: 'day_manga', // 漫画日榜
  },
  /**
   * 搜索选项
   * - 匹配标签或搜索标题
   */
  SEARCH_TARGET: {
    TAGS_PARTIAL: 'partial_match_for_tags', // 匹配标签
    TAGS_EXACT: 'exact_match_for_tags', // 标签完全匹配
    TITLE_AND_CAPTION: 'title_and_caption', // 搜索标题和说明文本
  },
  /**
   * 返回的图像不同尺寸选项
   */
  SIZE: {
    LARGE: 'large', // 大
    MEDIUM: 'medium', // 中
    ORIGINAL: 'original', // 原始尺寸
    SQUARE_MEDIUM: 'square_medium', // 正方形中等尺寸
  },
  /**
   * 返回内容的排序方法
   */
  SORT: {
    DATE_DESC: 'date_desc', // 按日期倒序
    DATE_ASC: 'date_asc', // 按日期升序
    MALE_DESC: 'popular_male_desc', // 男性受欢迎程度倒序
    FEMALE_DESC: 'popular_female_desc', // 女性受欢迎程度倒序
    POPULAR_DESC: 'popular_desc', // 总受欢迎程度倒序
  },
  /**
   * 某些用户功能（书签等）的可见性
   */
  VISIBILITY: {
    PUBLIC: 'public', // 公共
    PRIVATE: 'private', // 私人
  },
  FILTER: 'for_ios', // 过滤器，用于筛选特定的 iOS 平台数据
  AUTH_URL: 'https://oauth.secure.pixiv.net/auth/token', // Pixiv 鉴权服务的 URL
  API_BASE_URL: 'https://app-api.pixiv.net', // Pixiv API 服务的基础 URL
  USER_AGENT: 'PixivAndroidApp/5.0.234 (Android 11, Pixel 5)', // 用户代理，指示发起请求的客户端信息
  CLIENT_ID: 'MOBrBDS8blbauoSck0ZfDbtuzpyT', // Pixiv 应用程序的客户端 ID
  CLIENT_SECRET: 'lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj', // Pixiv 应用程序的客户端密钥
  // ACCEPT_LANGUAGE: {
  //   ZH_CN: 'zh-cn',
  //   ZH_TW: 'zh-tw',
  //   EN_US: 'en-us',
  //   JA_JP: 'ja-jp',
  //   KO_KR: 'ko-kr',
  // }, // 请求头中用于指定所接受语言的参数，支持的语言种类
  ACCEPT_LANGUAGE: '', // 请求头中用于指定所接受语言的参数，支持的语言种类
};
export default enums;
