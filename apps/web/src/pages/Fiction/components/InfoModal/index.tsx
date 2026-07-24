/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 10:22:14
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-19 15:35:00
 * @FilePath: /React-Ant/src/pages/Fiction/components/InfoModal/index.tsx
 * @Description: 弹窗详情组件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Button, Modal } from 'antd';
import React, { Key, useState } from 'react';
import { useFictionInfo } from '../utils/FictionInfoModal';
import ModalItem from './ModalItem';
interface Illustration {
  record: {
    id: Key;
    author: string;
    latestChapter: string;
    novelTitle: string;
    tag: string;
    url: string;
  };
}
const App: React.FC<Illustration> = ({ record }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = React.useState<{
    intro: string;
    links: Array<{ title: string; url: string }>;
    cover: string;
  }>({
    intro: '',
    links: [],
    cover: '',
  });
  const { getFictionInfo } = useFictionInfo(record);
  const showModal = async () => {
    const info = await getFictionInfo();
    setInfo(info);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        查看
      </Button>
      {isModalOpen && (
        <Modal
          title={record.novelTitle}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <ModalItem {...info} />
        </Modal>
      )}
    </>
  );
};

export default App;
