import { useRef } from 'react';

/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-30 16:07:49
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-30 16:07:53
 * @FilePath: /React-Ant/src/utils/scrollToTop.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const useScrollToTop = () => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    const element = cardContentRef.current;
    if (!element) return;
    const step = () => {
      element.scrollTop = element.scrollTop - 50; // 可以调整这个数值来控制滚动速度
      if (element.scrollTop > 0) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };
  return { cardContentRef, scrollToTop };
};
export { useScrollToTop };
