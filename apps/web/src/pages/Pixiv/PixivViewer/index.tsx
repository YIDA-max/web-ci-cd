/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-04 10:55:07
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-16 16:20:10
 * @FilePath: /React-Ant/src/pages/Pixiv/PixivViewer/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getIllustrationInfo } from '@/api/Pixiv';
import { getPixivLocalStorage } from '@/utils/localStorage';
import { useParams } from '@umijs/max';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

interface IndexProps {
  name: string;
  message: object;
  onClick: (a: number) => number;
}

const Index: React.FC<IndexProps> = () => {
  const { id } = useParams();
  useEffect(() => {
    const onMount = async () => {
      const pixiv = await getPixivLocalStorage('pixivInfo');
      const { data } = await getIllustrationInfo(pixiv, id as unknown as number);
      console.log(' ', data);
    };
    onMount();
  });
  return <div>User id: {id}</div>;
};

Index.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Index;
