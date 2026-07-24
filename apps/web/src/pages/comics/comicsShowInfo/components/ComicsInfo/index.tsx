/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-18 10:22:14
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 17:25:02
 * @FilePath: /React-Ant/src/pages/comics/comicsShowInfo/components/comicsInfo/index.tsx
 * @Description: 弹窗详情组件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getComicsInfo } from '@/api/comics/comicsList';
import { useModel } from '@umijs/max';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import ModalItem from './ModalItem';
import { IInfo, Illustration } from './types';
const App: React.FC<Illustration> = ({ toUrl, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setuserSpinning } = useModel('comicsShowInfoSpin');
  const [info, setInfo] = React.useState<IInfo>({
    heand: {
      title: '',
      author: '',
      year: '',
      status: '',
      updateDate: '',
      updateChapter: '',
      intro: '',
      allIntro: '',
      area: '',
      alias: '',
      plot: '',
    },
    like: [],
    Chapter: [],
    Volume: [],
    score: {
      scoreNum: '',
      scorePeople: '',
      scorePercent: {
        five: '',
        four: '',
        three: '',
        two: '',
        one: '',
      },
    },
    cover: '',
  });

  const showModal = async () => {
    try {
      setuserSpinning(true);
      const { data } = await getComicsInfo({
        toUrl,
      });
      setInfo(data);
      setuserSpinning(false);
      setIsModalOpen(true);
    } catch (error) {
      setuserSpinning(false);
    }
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
        <Modal title={name} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
          <ModalItem {...info} toUrl={toUrl} />
        </Modal>
      )}
    </>
  );
};

export default App;
