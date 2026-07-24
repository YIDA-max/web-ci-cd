/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-22 10:34:02
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-31 11:03:13
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/upData/upData.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { upData } from '@/api/Fiction/upData';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React from 'react';

interface IndexProps {
  callBack: () => void;
}
const { Dragger } = Upload;

const Index: React.FC<IndexProps> = ({ callBack }) => {
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.epub',
    action: async (file) => {
      await upData(file);
      callBack();
      return '';
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <div
      style={{
        width: '800px',
      }}
    >
      {' '}
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p className="ant-upload-hint">支持单个或批量上传。只支持epub格式</p>
      </Dragger>
    </div>
  );
};

export default Index;
