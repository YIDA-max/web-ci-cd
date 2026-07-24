/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-01 21:42:50
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-01 21:44:16
 * @FilePath: /React-Ant/src/pages/Pixiv/Recommend/expandedRowRender.tsx
 * @Description:点击展开的组件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { ProTable } from '@ant-design/pro-components';
import { Space, Tag } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import MyImage from './MyImage';
interface Illustration {
  id: number;
  title: string;
  type: 'illust' | 'manga' | 'ugoira' | 'novel';
  caption: string;
  restrict: 0 | 1 | 2;
  user: {
    uid: number;
    name: string;
    account: string;
  };
  tags: {
    name: string;
    translated_name: string | null;
  }[];
  create_date: string;
  page_count: number;
  sanity_level: 1 | 2 | 3 | 4 | 5 | 6;
  x_restrict: 0 | 1;
  is_bookmarked: boolean;
  total_bookmarks: number;
  total_view: number;
  image_urls: {
    square_medium: string;
    medium: string;
    large: string;
  };
  meta_single_page: {
    original_image_url: string;
  };
  meta_pages: never[];
}
// 定义展开行时如何检索嵌套数据
export const handleExpand = async (expanded: boolean, record: Illustration) => {
  if (expanded) {
    return record;
  }
};
export const expandedRowRender = (record: Illustration) => {
  return (
    <ProTable
      columns={[
        {
          title: '标题',
          dataIndex: 'title',
          tip: '推荐的标题',
          width: 100,
        },
        {
          title: '作者内容',
          dataIndex: 'caption',
          tip: '作者的额外补充',
          render: () => (
            <div
              style={{ width: '100%', overflowX: 'auto' }}
              onClick={() => {
                console.log(record);
              }}
            >
              {ReactHtmlParser(record?.caption ? record.caption : '该作者没有补充哦')}
            </div>
          ),
        },
        {
          disable: true,
          title: '标签',
          dataIndex: 'tags',
          search: false,
          render: () => (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <Space wrap={true}>
                {record.tags.map(({ name }) => (
                  <Tag
                    color={(function () {
                      // 函数体
                      const letters = '0123456789ABCDEF';
                      let color = '#';
                      for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                      }
                      return color;
                    })()}
                    key={name}
                  >
                    {name}
                  </Tag>
                ))}
              </Space>
            </div>
          ),
        },
        {
          disable: true,
          title: '图片',
          dataIndex: 'image_urls',
          search: false,
          render: () => (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <MyImage src={record.image_urls.large} />
            </div>
          ),
        },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={[record]}
      pagination={false}
      rowKey="title"
    />
  );
};
