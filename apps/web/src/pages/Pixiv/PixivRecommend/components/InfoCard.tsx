/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 09:49:44
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-01 14:49:12
 * @FilePath: /React-Ant/src/pages/Pixiv/components/InfoCard.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Collapse, theme } from 'antd';
const { Panel } = Collapse;
/**
 * 每个单独的卡片，为了复用样式抽成了组件,这里的组件是一个函数组件,可以自定义进行扩展
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  content?: React.FC;
  href: string;
  isUnfold: boolean;
}> = ({
  title,
  href,
  index,
  content = () => {
    return <div></div>;
  },
  isUnfold,
}) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <Collapse defaultActiveKey={isUnfold ? '1' : 'false'}>
      <Panel
        header={
          <span>
            {index}:{title}
          </span>
        }
        key="1"
      >
        <div
          style={{
            fontSize: '14px',
            color: token.colorTextSecondary,
            textAlign: 'justify',
            lineHeight: '22px',
            marginBottom: 8,
          }}
        >
          {content({})}
        </div>
        <a href={href} target="_blank" rel="noreferrer">
          了解更多 {'>'}
        </a>
      </Panel>
    </Collapse>
  );
};
export default InfoCard;
