/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:47:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 11:03:11
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/common/tagToTypes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { tag } from '../constants/types';

export default (val: any): tag => {
  return new tag(val.name, val.translated_name);
};
