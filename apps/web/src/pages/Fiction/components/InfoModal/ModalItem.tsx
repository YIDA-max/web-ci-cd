/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 11:33:46
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-18 16:48:24
 * @FilePath: /React-Ant/src/pages/Fiction/FictionList/components/InfoModal/ModalItem.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Button, Image, List } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
interface Iinfo {
  intro: string;
  links: Array<{ title: string; url: string }>;
  cover: string;
}

const Index: React.FC<Iinfo> = (info) => {
  return (
    <div
      style={{
        height: '600px',
        overflow: 'auto',
      }}
    >
      <Image src={info.cover} alt="" width={200} />
      <h2>简介:</h2>
      <div>{info.intro}</div>
      <h2>正文:</h2>
      <List
        bordered
        dataSource={info.links}
        renderItem={(item) => (
          <List.Item>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <div style={{ height: '32px', lineHeight: '32px' }}>{item.title}</div>{' '}
              <Button
                onClick={() => {
                  const encodedUrl = encodeURIComponent(item.url);
                  history.push(`/fiction/FictionInfo/${encodedUrl}`);
                }}
              >
                阅读
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

Index.propTypes = {};

export default Index;
