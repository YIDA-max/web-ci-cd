/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:47:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 11:02:31
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/common/illustToTypes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { common } from '../common';
import { illustration, tag, userInformation } from '../constants/types';

/**
 * Convert illustration to its coresponding type
 * @param val Object contains illustration information from Pixiv responses
 * @returns Illustration object
 */
export default (val: any): illustration => {
  return new illustration(
    val.id,
    val.title,
    val.type,
    val.caption,
    val.restrict,
    new userInformation(val.user.id, val.user.name, val.user.account),
    (() => {
      let rt = new Array<tag>();
      for (let value of val.tags) {
        rt.push(common.tagToTypes(value));
      }
      return rt;
    })(),
    val.create_date,
    val.page_count,
    val.sanity_level,
    val.x_restrict,
    val.is_bookmarked,
    val.total_bookmarks,
    val.total_view,
    val.image_urls,
    val.meta_single_page,
    val.meta_pages,
  );
};
