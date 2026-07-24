import { getMyFictionList } from '@/api/Fiction/upData';
import React from 'react';
import BookList from './bookItem';
import styles from './styles.less';
interface IndexProps {
  callback: (value: string) => void;
}

const Index: React.FC<IndexProps> = ({ callback }) => {
  const [FictionList, setFictionList] = React.useState<Array<string>>([]); // 小说列表
  React.useEffect(() => {
    const onMount = async () => {
      const resList = await getMyFictionList();
      setFictionList(resList.data);
    };
    onMount();
  }, []);
  return (
    <div>
      <div className={styles.bookList}>
        {FictionList.map((item) => {
          return <BookList item={item} key={item} callback={callback} />;
        })}
      </div>
    </div>
  );
};

export default Index;
