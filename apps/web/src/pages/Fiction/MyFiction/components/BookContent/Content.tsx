/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-30 10:44:42
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-30 17:21:24
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/BookContent/Content.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { useScrollToTop } from '@/utils/scrollToTop';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.less';
interface IndexProps {
  htemlInfo: {
    data: string;
  };
}
const Index: React.FC<IndexProps> = ({ htemlInfo }) => {
  const { cardContentRef, scrollToTop } = useScrollToTop();
  React.useEffect(() => {
    if (cardContentRef.current && htemlInfo) {
      scrollToTop();
    }
  }, [htemlInfo]);
  return (
    <div className={styles.Content} ref={cardContentRef}>
      <div dangerouslySetInnerHTML={{ __html: htemlInfo.data }}></div>
    </div>
  );
};

Index.propTypes = {
  htemlInfo: PropTypes.shape({
    data: PropTypes.string.isRequired,
  }).isRequired,
};

export default Index;
