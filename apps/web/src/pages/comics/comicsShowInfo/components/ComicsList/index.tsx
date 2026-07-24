/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 16:57:56
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 15:05:57
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicsList/index.tsx
 * @Description: 列表组件的index
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getComicList } from '@/api/comics/comicsList';
import React from 'react';
import { ListTitle } from './config/index';
import MangaBookShelf from './MangaBookShelf';
import { IListInfo, IListInfoItem } from './types/index';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IndexProps {}
const Index: React.FC<IndexProps> = () => {
  const [comicList, setComicList] = React.useState<IListInfo>({
    hotOngoingManga: [],
    classicFinished: [],
    hotRecommendations: [],
    latestShelves: [],
    newSeriesManga: [],
    mangaRecommendations: [],
  });
  React.useEffect(() => {
    const onMonent = async () => {
      const requestData = await getComicList();
      if (requestData?.data) {
        setComicList(requestData?.data);
      }
    };
    onMonent();
  }, []);
  return (
    <div>
      <div>
        {Object.entries(comicList).map((items, index) => {
          const [key, value] = items;
          return (
            <MangaBookShelf
              ArrayItem={value as Array<IListInfoItem>}
              title={ListTitle[key as keyof IListInfo]}
              isSearch={false}
              key={index}
            />
          );
        })}
      </div>
      <div>
        <MangaBookShelf ArrayItem={[]} title={'漫画搜索'} isSearch={true} />
      </div>
    </div>
  );
};
export default Index;
