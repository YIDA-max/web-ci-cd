/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 16:43:05
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-05 10:58:31
 * @FilePath: /React-Ant/src/pages/Fiction/FictionInfo/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getBookText } from '@/api/Fiction/FictionList';
import { useParams } from '@umijs/max';
import { Card, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import CardInfo from './components/CardInfo';
const Index: React.FC = () => {
  const { url } = useParams();
  const [bookText, setBookText] = useState<{
    title: string;
    content: Array<string>;
    nextUrl: string;
    prevUrl: string;
    url: string;
  }>({
    title: '',
    content: [],
    nextUrl: '',
    prevUrl: '',
    url: '',
  });
  useEffect(() => {
    const onMount = async () => {
      // 如果url是空白就需要返回
      if (url !== 'undefined') {
        const data = await getBookText(url as string);
        if (data?.data) {
          setBookText(data.data);
        }
      } else {
        message.error('章节错误');
        history.push('/fiction/FictionList');
      }
    };
    onMount();
  }, [url]);
  return (
    <div>
      <Card bodyStyle={{ display: 'flex' }}>
        <CardInfo {...bookText} />
      </Card>
    </div>
  );
};
export default Index;
