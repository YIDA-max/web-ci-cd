/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-30 10:38:33
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-30 11:46:44
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/Bookshelf/bookItem.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.less';
interface IndexProps {
  item: string;
  callback: (value: string) => void;
}

const Index: React.FC<IndexProps> = ({ item, callback }) => {
  return (
    <div className={styles.bookListItem}>
      <Button
        type="text"
        onClick={() => {
          callback(item);
        }}
      >
        {item}
      </Button>
    </div>
  );
};

Index.propTypes = {
  item: PropTypes.string.isRequired,
};

export default Index;
