import { getMyFictionItemContent, getMyFictionItemInfo } from '@/api/Fiction/upData';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';
import { SearchOutlined } from '@ant-design/icons';
import { Affix, Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { RefObject, useRef, useState } from 'react';
import styles from './styles.less';
import { IFictionItemInfo, IndexProps } from './types/TableOfContents';
// 定位目录位置的方法
const toScrollIntoView = (myButtonRef: RefObject<HTMLElement>) => {
  if (myButtonRef && myButtonRef.current)
    myButtonRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
};
const Index: React.FC<IndexProps> = ({ FictionItemName, callback }) => {
  // 小说目录详情
  const [FictionItemInfo, setsFictionItemInfo] = React.useState<IFictionItemInfo>({
    toc: [],
    title: '',
    date: '',
    creator: '',
    filename: '',
  });
  // 小说确定章节的详情
  const [ItemState, setItemState] = React.useState<{
    id: string;
  }>({
    id: '',
  });
  // 当前整个目录组件最大的ref
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // 定位到当前章节的ref
  const myButtonRef = useRef<HTMLElement>(null);
  // 一但FictionItemName变化,就重新查询
  React.useEffect(() => {
    if (FictionItemName) {
      getMyFictionItemInfo({
        name: FictionItemName,
      }).then((res) => {
        setsFictionItemInfo(res);
        setLocalStorage('BookTableOfContentsInfo', {
          info: res,
        });
      });
    }
  }, [FictionItemName]);
  // 初始化的时候进行初始化操作,比如说从localStorage中获取数据,定位目录结构
  React.useEffect(() => {
    const onMount = async () => {
      // 获取localStorage中的数据
      const info = await getLocalStorage('BookTableOfContentsInfo');
      const state = await getLocalStorage('BookTableOfContentsItemState');
      if (info) {
        setsFictionItemInfo(info.info);
      }
      if (state) {
        setItemState(state.state);
      }
      // 定位目录结构
      while (true) {
        if (myButtonRef.current) {
          toScrollIntoView(myButtonRef);
          break;
        } else {
          await new Promise((resolve) => {
            setTimeout(resolve, 100);
          });
        }
      }
    };
    onMount();
  }, []);
  // 修改正文的方法
  const onBookData = async (item: IFictionItemInfo['toc'][0], index: number) => {
    const { data } = await getMyFictionItemContent({
      id: item.id,
      name: FictionItemName ? FictionItemName : FictionItemInfo.filename,
    });
    callback({
      data,
      title: item.title,
      nextTitle: FictionItemInfo?.toc[index + 1]?.title,
      prevTitle: FictionItemInfo?.toc[index - 1]?.title,
      nextId: FictionItemInfo?.toc[index + 1]?.id,
      prevId: FictionItemInfo?.toc[index - 1]?.id,
      filename: FictionItemInfo.filename,
    });
    // 保存初始状态
    setItemState({
      id: item.id,
    });
    // 保存在localStorage中
    setLocalStorage('BookTableOfContentsItemState', {
      state: {
        id: item.id,
      },
    });
  };

  return (
    <div className={styles.TableOfContents} ref={setContainer}>
      <Affix
        target={() => container}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
        }}
      >
        <Tooltip title="点击跳转到当前章节">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => {
              toScrollIntoView(myButtonRef);
            }}
            style={{
              opacity: 1,
              zIndex: 9999,
            }}
          />
        </Tooltip>
      </Affix>
      <div>目录:</div>
      {FictionItemInfo?.toc?.map((item, index) => {
        return (
          <div
            key={item.id}
            className={styles.TableOfContentsItem}
            style={{
              color: 'red',
            }}
          >
            <Button
              type={item.id === ItemState.id ? 'primary' : 'text'}
              onClick={async () => {
                onBookData(item, index);
              }}
              ref={item.id === ItemState.id ? myButtonRef : null}
            >
              {item.title}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
Index.propTypes = {
  FictionItemName: PropTypes.string.isRequired,
};

export default Index;
