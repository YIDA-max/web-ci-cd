/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 10:47:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 10:53:00
 * @FilePath: /React-Ant/src/pages/Pixiv/utils/common/getDate.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/**
 * Get current date
 * @returns Date today in YYYY-mm-dd
 */
export default (timestamp: number) => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(timestamp - offset * 60 * 1000).toISOString().split('T')[0];
};
