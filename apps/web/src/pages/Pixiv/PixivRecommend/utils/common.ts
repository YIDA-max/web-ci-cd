/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:47:57
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 10:51:14
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/common.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import CommentToTypes from './common/commentToTypes';
import GetDate from './common/getDate';
import IllustToTypes from './common/illustToTypes';
import TagToTypes from './common/tagToTypes';
import TokenBase64 from './common/tokenBase64';
import enums from './constants/enums';

/**
 * Common items shared between multiple methods
 * `CLIENT_ID`, `CLIENT_SECRET`, etc.
 */
export const common = {
  commentToTypes: CommentToTypes,
  illustToTypes: IllustToTypes,
  tokenBase64: TokenBase64,
  tagToTypes: TagToTypes,
  getDate: GetDate,
  setLanguage: (str: 'zh-cn' | 'zh-tw' | 'en-us' | 'ja-jp' | 'ko-kr'): void => {
    enums.ACCEPT_LANGUAGE = str;
  },
};
