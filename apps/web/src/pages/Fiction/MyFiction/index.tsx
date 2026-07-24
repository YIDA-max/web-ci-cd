/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-22 10:06:45
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-31 10:56:28
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import BookContent from './components/BookContent';
import BookSheif from './components/Bookshelf';
import UpData from './components/upData';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [FictionItemName, setFictionItemName] = React.useState<string>(''); // 小说名字];
  return (
    <div>
      <div>
        <BookSheif
          callback={function (value: string): void {
            setFictionItemName(value);
          }}
        />
      </div>
      <br />
      <div>
        <BookContent FictionItemName={FictionItemName} />
      </div>
      <div>
        <UpData callBack={function (): void {}} />
      </div>
    </div>
  );
};

export default Index;
