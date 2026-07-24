/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-30 11:58:20
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 10:45:45
 * @FilePath: /React-Ant/src/pages/Fiction/FictionList/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getBookList, searchBook } from '@/api/Fiction/FictionList';
import { ActionType, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { Illustration, useGetColumns } from './config/index';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { FictionListIndexColumns } = useGetColumns();
  return (
    <div
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        padding: '0 16px',
      }}
    >
      <ProTable<Illustration>
        columns={FictionListIndexColumns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const { current, keyword } = params;
          if (keyword) {
            return await searchBook(keyword);
          } else {
            return await getBookList(current ? current : 1);
          }
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 40,
        }}
        dateFormatter="string"
        headerTitle="小说列表"
      />
    </div>
  );
};

export default Index;
