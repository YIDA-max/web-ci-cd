/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 10:37:16
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-19 15:06:39
 * @FilePath: /React-Ant/src/pages/Fiction/FictionList/config/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { ProColumns } from '@ant-design/pro-components';
import { Key } from 'react';
import InfoModal from '../../components/InfoModal';
interface Illustration {
  id: Key;
  author: string;
  latestChapter: string;
  novelTitle: string;
  tag: string;
  url: string;
}
const useGetColumns = () => {
  const FictionListIndexColumns: ProColumns<Illustration>[] = [
    {
      title: '关键字查询',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      hideInSearch: true,
    },
    {
      title: '作品',
      dataIndex: 'novelTitle',
      hideInSearch: true,
    },
    {
      title: '最新章节',
      dataIndex: 'latestChapter',
      hideInSearch: true,
    },
    {
      title: '地址',
      dataIndex: 'url',
      hideInSearch: true,
      render: (_text, record) => [
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="url">
          {record.url}
        </a>,
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_text, record) => [<InfoModal record={record} key="info" />],
    },
  ];
  return { FictionListIndexColumns };
};

export { useGetColumns, Illustration };
