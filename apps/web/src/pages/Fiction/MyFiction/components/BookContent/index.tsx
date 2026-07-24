/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-05-30 10:43:53
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-05 14:47:06
 * @FilePath: /React-Ant/src/pages/Fiction/MyFiction/components/BookContent/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';
import PropTypes from 'prop-types';
import React from 'react';
import Content from './Content';
import styles from './styles.less';
import TableOfContents from './TableOfContents';
interface IndexProps {
  FictionItemName: string;
}
interface IhtemlInfo {
  data: string;
  title: string;
  nextTitle: string;
  prevTitle: string;
  nextId: string;
  prevId: string;
  filename: string;
}
const Index: React.FC<IndexProps> = ({ FictionItemName }) => {
  const [htemlInfo, setHtemlInfo] = React.useState<IhtemlInfo>({
    data: '',
    title: '',
    nextTitle: '',
    prevTitle: '',
    nextId: '',
    prevId: '',
    filename: '',
  }); // 小说具体的内容
  React.useEffect(() => {
    const onMount = async () => {
      const data = await getLocalStorage('BookContentHtml');
      if (data.info) {
        setHtemlInfo(data.info);
      }
    };
    onMount();
  }, []);
  return (
    <div className={styles.BookContent}>
      <TableOfContents
        FictionItemName={FictionItemName}
        callback={function (value: IhtemlInfo): void {
          setHtemlInfo(value);
          if (value.data.length < 4900000)
            setLocalStorage('BookContentHtml', {
              info: value,
            });
        }}
      />
      <Content htemlInfo={htemlInfo} />
    </div>
  );
};
Index.propTypes = {
  FictionItemName: PropTypes.string.isRequired,
};

export default Index;
