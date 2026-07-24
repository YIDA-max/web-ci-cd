/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-05 16:57:56
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 17:20:27
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicsList/MangaBookShelf.tsx
 * @Description: 列表组件的index
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { searchComics } from '@/api/comics/comicsList';
import { useModel } from '@umijs/max';
import { Card, Image, Input, Spin, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import LookInfo from '../ComicsInfo';
const { Paragraph } = Typography;
const { Meta } = Card;
interface IListInfoItemArray {
  name: string;
  toUrl: string;
  imgSrc?: string;
  ttSection?: string;
  desc?: string;
}
interface IndexProps {
  ArrayItem: Array<IListInfoItemArray>;
  title: string;
  isSearch?: boolean;
}
const Index: React.FC<IndexProps> = ({ title, ArrayItem, isSearch }) => {
  const [ListInfo, setListInfo] = React.useState<Array<IListInfoItemArray>>([]);
  const { userSpinning } = useModel('comicsShowInfoSpin');
  React.useEffect(() => {
    setListInfo(ArrayItem);
  }, [ArrayItem]);
  const onSearch = async (value: string) => {
    try {
      const { data } = await searchComics({ keyWord: value });
      if (data) {
        setListInfo(data);
      }
    } catch (error) {
      console.log(' ', error);
    }
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '20px' }}>{title}</span>
        {isSearch && (
          <Input.Search
            placeholder="支持模糊,拼音查询"
            onSearch={onSearch}
            style={{ width: 200 }}
          ></Input.Search>
        )}
      </div>
      <div
        style={{
          height: '450px',
          overflow: 'auto',
          width: '100%',
          display: 'flex',
        }}
      >
        {ListInfo.filter((item) => item.imgSrc && item.name).map((items, index) => {
          return (
            <div
              key={index}
              style={{
                width: '200px',
                height: '400px',
                margin: '10px',
              }}
            >
              <Card
                hoverable
                cover={
                  <Image
                    alt="example"
                    style={{
                      width: '200px',
                    }}
                    src={items.imgSrc}
                  />
                }
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Meta
                  title={items.ttSection}
                  description={
                    <div>
                      <Spin spinning={userSpinning}>
                        <LookInfo toUrl={items.toUrl} name={items.name} />
                      </Spin>
                      <Paragraph ellipsis={{ rows: 2, expandable: false }} onClick={() => {}}>
                        {items.desc ? items.desc : items.name ? items.name : ''}
                      </Paragraph>
                    </div>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const itemPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  toUrl: PropTypes.string.isRequired,
}).isRequired;
Index.propTypes = {
  ArrayItem: PropTypes.arrayOf(itemPropType).isRequired,
  title: PropTypes.string.isRequired,
  isSearch: PropTypes.bool,
};

export default Index;
