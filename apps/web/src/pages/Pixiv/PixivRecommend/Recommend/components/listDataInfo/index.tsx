/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 11:58:20
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-16 15:20:51
 * @FilePath: /React-Ant/src/pages/Pixiv/PixivRecommend/Recommend/components/listDataInfo/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Recommend } from '@/api/Pixiv';
import { getPixivLocalStorage } from '@/utils/localStorage';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';
import { history } from '@umijs/max';
import { expandedRowRender, handleExpand } from './expandedRowRender';
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
const columns: ProColumns<Illustration>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '作品ID',
    dataIndex: 'id',
    width: 100,
  },

  {
    disable: true,
    title: '作者ID',
    dataIndex: 'uid',
    copyable: true,
    search: false,
    render: (_, record) => (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Space wrap={true}>
          作者id: {record.user.uid}
          作者名字: {record.user.name}
        </Space>
      </div>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'create_date',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record) => [
      <Button
        rel="noopener noreferrer"
        key="view"
        onClick={() => {
          history.push(`/Pixiv/PixivViewer/${record.id}`);
        }}
      >
        查看
      </Button>,
    ],
  },
];

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
      onClick={() => {}}
    >
      <ProTable<Illustration>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          const userInfo = await getPixivLocalStorage('pixivInfo');
          if (!userInfo?.access_token) {
            return { data: [], success: true };
          }
          try {
            const { data } = await Recommend(
              { ...userInfo, expire_time: 3600 },
              {
                contentType: 'ILLUSTRATION',
                includeRankingIllustration: 'true',
                includeRankingLabel: 'true',
              },
            );
            return { data: data || [], success: true };
          } catch (e) {
            console.error('Pixiv recommend failed', e);
            return { data: [], success: false };
          }
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange() {},
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          resetText: '推荐',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        expandable={{ expandedRowRender, onExpand: handleExpand }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="推荐内容"
      />
    </div>
  );
};

export default Index;
