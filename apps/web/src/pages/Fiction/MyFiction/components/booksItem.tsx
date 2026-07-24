/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-22 10:33:21
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-22 15:18:04
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/booksItem.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import PropTypes from 'prop-types';
import React from 'react';

interface IndexProps {
  name: string;
  message: object;
  onClick: (a: number) => number;
}

const Index: React.FC<IndexProps> = () => {
  return <div></div>;
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
