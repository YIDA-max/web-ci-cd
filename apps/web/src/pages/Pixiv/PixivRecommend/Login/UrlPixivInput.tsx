/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-26 14:14:59
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-04-29 19:53:23
 * @FilePath: /React-Ant/src/pages/Pixiv/Login/UrlPixivInput.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { LoginInfo } from '@/api/Pixiv';
import { setLocalStorage } from '@/utils/localStorage';
import { Input, message } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useModel } from '@umijs/max';

interface UrlPixivInputProps {
  code_verifier: string;
}
// 校验是否正确的函数
const checkUrl: (value: string) => boolean = (value: string) => {
  if (value.search('pixiv://account/login') === -1) {
    message.error('请输入正确的URL');
    return false;
  } else {
    return true;
  }
};
// 获取到登录信息的函数
const onBlurGetInfo: (
  value: string,
  code_verifier: string,
  setuserInfo: (data: any) => void,
  setvalue: (value: string) => void,
) => void = async (value, code_verifier, setuserInfo, setvalue) => {
  const flag = checkUrl(value);
  if (flag) {
    // 到这里之后我们就可以开始计算拿到code了
    const AUTH_CODE = new URLSearchParams(value.substring(21)).get('code');
    // 拿到code之后就可以发起请求进行获取到用户的信息和最重要的token了
    const { data } = await LoginInfo(AUTH_CODE as string, code_verifier);
    if (data) {
      setuserInfo(data);
      setLocalStorage('pixivInfo', data);
      message.success('登录成功');
    }
  } else {
    setvalue('');
  }
};
/**
 * @description: 函数组件,校验输入的是否正确
 * */
const UrlPixivInput: React.FC<UrlPixivInputProps> = ({ code_verifier }) => {
  const [value, setvalue] = React.useState<string>('');
  const { setuserInfo } = useModel('Pixiv');
  return (
    <div>
      <Input
        value={value}
        onBlur={async () => {
          onBlurGetInfo(value, code_verifier, setuserInfo, setvalue);
        }}
        onChange={({ target }) => {
          setvalue(target.value);
        }}
      />
    </div>
  );
};

UrlPixivInput.propTypes = {
  code_verifier: PropTypes.string.isRequired,
};

export default UrlPixivInput;
