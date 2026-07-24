/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 16:43:05
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-16 16:11:09
 * @FilePath: /React-Ant/src/pages/comics/comicsView/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getViewComicChapter, getViewComicsImg } from '@/api/comics/comicsView';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { Button, Card, Image, message, Pagination, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import { IInfo } from './types';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const Index: React.FC = () => {
  const { url } = useParams();
  const [comicsInfo, setcomicsInfo] = useState<IInfo>({
    bid: 0,
    bname: '',
    bpic: '',
    cid: 0,
    cname: '',
    file: '',
    finished: false,
    len: 0,
    path: '',
    status: 0,
    block_cc: '',
    nextId: 0,
    prevId: 0,
    files: [],
    sl: {
      e: 0,
      m: '',
    },
  });
  const [page, setpage] = useState<number>(1);
  const [img, setimg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const onMount = async () => {
      // 初始化
      setpage(1);
      setLoading(true);
      // 如果url是空白就需要返回
      if (url !== 'undefined') {
        const data = await getViewComicChapter({
          toUrl: url as string,
        });
        if (data.code === 200) {
          // 设置漫画信息
          setcomicsInfo(data.data);
          setLoading(true);
          // 改变url的时候,需要重新获取图片获取第一张
          const img = await getViewComicsImg({
            sl: data.data.sl,
            cid: data.data.cid,
            path: data.data.path,
            file: data.data.files[0],
          });
          if (img.code === 200) {
            setimg(img.data);
            setLoading(false);
          }
        }
      } else {
        message.error('漫画章节错误');
        history.push('/comics/comicsShowInfo');
      }
    };
    onMount();
  }, [url]);
  // 页签改变获取数据
  const changePage = async (page: number) => {
    setLoading(true);
    const data = await getViewComicsImg({
      sl: comicsInfo.sl,
      cid: comicsInfo.cid,
      path: comicsInfo.path,
      file: comicsInfo.files[page - 1],
    });
    if (data.code === 200) {
      setpage(page);
      setimg(data.data);
      setLoading(false);
    }
  };
  // 改变章节的函数
  const changeChapter = async (isNext: boolean) => {
    const encodedUrl = encodeURIComponent(
      `http://www.manhuagui.com/comic/${comicsInfo.bid}/${
        isNext ? comicsInfo.nextId : comicsInfo.prevId
      }.html`,
    );
    history.push(`/comics/comicsView/${encodedUrl}`);
    setpage(1);
  };
  return (
    <div>
      <Spin indicator={antIcon} spinning={loading}>
        <Card
          title={comicsInfo.bname}
          extra={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '400px',
              }}
            >
              <Button
                onClick={() => {
                  history.push(`/comics/comicsShowInfo`);
                }}
              >
                返回列表
              </Button>
              <Button
                onClick={() => {
                  changeChapter(false);
                }}
              >
                上一章
              </Button>
              <Button
                onClick={() => {
                  changeChapter(true);
                }}
              >
                下一章
              </Button>
              <Button
                disabled={page === 1}
                onClick={async () => {
                  changePage(page - 1);
                }}
              >
                上一页
              </Button>
              <Button
                disabled={page === comicsInfo.files.length}
                onClick={async () => {
                  changePage(page + 1);
                }}
              >
                下一页
              </Button>
            </div>
          }
        >
          <div style={{ textAlign: 'center' }}>
            <Image src={img} alt="" preview={true} />
          </div>
        </Card>
        <Pagination
          pageSize={1}
          total={comicsInfo.files.length}
          current={page}
          showSizeChanger={false}
          showQuickJumper={true}
          hideOnSinglePage={true}
          onChange={(page) => {
            changePage(page);
          }}
        />
      </Spin>
    </div>
  );
};
export default Index;
