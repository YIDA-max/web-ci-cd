/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-08 10:17:47
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-08 16:29:59
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicOverview/comicTable/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getComicsTable } from '@/api/comics/comicsList';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useRef } from 'react';
import { columns, GithubIssueItem } from './config';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};
export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params) => {
        return await getComicsTable(params);
      }}
      editable={{
        type: 'multiple',
      }}
      rowKey="name"
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
        optionRender: ({ searchText, resetText }, { form }) => [
          <Space key="Space">
            <Button
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>
            <Button
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>
          </Space>,
        ],
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
        initialValues: {
          area: '',
          tags: '',
          audience: '',
          year: '',
          letter: '',
          status: '',
          sort: 'index.html',
        },
      }}
      pagination={{
        pageSize: 42,
      }}
      dateFormatter="string"
      headerTitle="查询结果"
    />
  );
};
