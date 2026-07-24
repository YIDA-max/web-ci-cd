/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 16:50:15
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 17:20:00
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/index.tsx
 * @Description: 漫画柜列表的index
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import ComicOverview from './components/ComicOverview';
import ComicsList from './components/ComicsList';
import style from './styles.less';

const Index: React.FC = () => {
  return (
    <div className={style.ComicsMain}>
      <div className={style.ComicsList}>
        <ComicsList />
      </div>
      <div className={style.ComicsInfo}>
        <ComicOverview />
      </div>
    </div>
  );
};
export default Index;
