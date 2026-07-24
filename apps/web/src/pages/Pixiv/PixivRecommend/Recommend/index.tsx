/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 11:11:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-01 21:51:49
 * @FilePath: /React-Ant/src/pages/Pixiv/Recommend/index.tsx
 * @Description:获取推荐信息模块
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import ListDataInfo from './components/listDataInfo';
// const options = [
//   {
//     label: '图片',
//     value: 'ILLUSTRATION',
//   },
//   {
//     label: '漫画',
//     value: 'MANGA',
//   },
//   {
//     label: '动图',
//     value: 'UGOIRA',
//   },
//   {
//     label: '小说',
//     value: 'NOVEL',
//   },
// ];
const Index: React.FC = () => {
  return (
    <div>
      <ListDataInfo />
    </div>
  );
};
export default Index;
