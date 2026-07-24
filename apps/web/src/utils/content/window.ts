/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-19 11:01:44
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-19 11:01:55
 * @FilePath: /React-Ant/src/utils/window.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滚动
  });
};

export { scrollToTop };
