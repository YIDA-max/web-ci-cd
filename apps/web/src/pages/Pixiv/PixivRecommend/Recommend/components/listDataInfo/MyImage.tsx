/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-04 10:16:26
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-31 11:29:29
 * @FilePath: /React-Ant/src/pages/Pixiv/PixivRecommend/Recommend/components/listDataInfo/MyImage.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Referer } from '@/api/Pixiv';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
interface IndexProps {
  src: string;
}

const Index: React.FC<IndexProps> = ({ src }) => {
  const [image, setImage] = useState('');
  useEffect(() => {
    const info = async () => {
      const fileType = src.split('.').pop(); // 获取图片名称，与原代码类似
      const data = await Referer(src);
      setImage(`data:image/${fileType};base64,${data?.base64}`);
    };
    info();
  }, [src]);
  return <Image width={200} src={image} placeholder={true} />;
};
Index.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Index;
