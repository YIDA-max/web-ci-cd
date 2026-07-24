/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 11:22:22
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-26 12:11:25
 * @FilePath: /React-Ant/src/components/KeyWord/index.tsx
 * @Description:关键字组件,想要提醒,并且附带解释的时候可以使用
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
interface KeyWordProps {
  keyWord?: string;
  explain?: string;
  style?: object;
}
/**
 * @description:一个函数组件,用于标记关键字
 * @param {string} 关键字
 * @param {string} 关键字的解释
 * @param {object} 样式
 * @return {React.FC}
 */
const KeyWord: React.FC<KeyWordProps> = ({ keyWord, explain, style }) => {
  return (
    <span style={{ ...style }}>
      {' '}
      <span>{keyWord}</span>
      <Tooltip title={explain}>
        <QuestionCircleOutlined />
      </Tooltip>
    </span>
  );
};

KeyWord.propTypes = {
  keyWord: PropTypes.string,
  explain: PropTypes.string,
  style: PropTypes.object,
};
KeyWord.defaultProps = {
  keyWord: '关键字',
  explain: '关键字的解释',
  style: { color: 'red', margin: '0 px' },
};
export default KeyWord;
