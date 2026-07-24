/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:47:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 11:01:59
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/common/commentToTypes.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { comment, userInformation } from '../constants/types';

/**
 * Convert comment to its coresponding type
 * @param val Object contains comment information from Pixiv responses
 * @returns comment object
 */
export default function getComment(val: any, hasParentComment: 'true' | 'false'): comment {
  return new comment(
    val.id,
    val.comment,
    val.date,
    new userInformation(val.user.id, val.user.name, val.user.account),
    hasParentComment === 'true' ? getComment(val.parent_comment, 'false') : undefined,
  );
}
