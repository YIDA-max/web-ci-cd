/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 11:33:46
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-16 16:30:16
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/ComicsInfo/ModalItem.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Button, Image, List, Typography } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import style from './style/Modalitem.less';
import { IInfo } from './types';
const { Paragraph } = Typography;
const Index: React.FC<IInfo> = (info) => {
  return (
    <div
      style={{
        height: '600px',
        overflow: 'auto',
      }}
    >
      <Image src={info.cover} alt="" width={200} />
      <Button type={'link'} href={info.toUrl} target={'_blank'}>
        {info.heand.title}
      </Button>
      <h2>简介:</h2>
      <Paragraph ellipsis={{ rows: 3, expandable: false }} onClick={() => {}}>
        {info.heand.allIntro}
      </Paragraph>
      <Button onClick={() => {}}>下载</Button>
      <h2>猜你喜欢</h2>
      <div className={style.infolike}>
        {info.like.map((item) => {
          return (
            <div key={item.imgSrc} className={style.item}>
              <Image src={item.imgSrc} alt="" width={'80%'} />
              <span className={style.span}>
                <Button type={'link'} href={item.toUrl} target={'_blank'}>
                  {item.name}
                </Button>
              </span>
            </div>
          );
        })}
      </div>
      {info.Chapter.length > 0 && (
        <div>
          <h2>正文话:</h2>
          <List
            bordered
            dataSource={info.Chapter}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ height: '32px', lineHeight: '32px' }}>{item.chapterName}</div>{' '}
                  <Button
                    onClick={() => {
                      const encodedUrl = encodeURIComponent(item.toUrl);
                      history.push(`/comics/comicsView/${encodedUrl}`);
                    }}
                  >
                    阅读
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
      {info.Volume.length > 0 || info.Chapter.length > 0 ? <hr /> : null}
      {info.Volume.length > 0 && (
        <div>
          <h2>正文卷:</h2>
          <List
            bordered
            dataSource={info.Volume}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ height: '32px', lineHeight: '32px' }}>{item.volumeName}</div>{' '}
                  <Button
                    onClick={() => {
                      const encodedUrl = encodeURIComponent(item.toUrl);
                      history.push(`/comics/comicsView/${encodedUrl}`);
                    }}
                  >
                    阅读
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

Index.propTypes = {};

export default Index;
