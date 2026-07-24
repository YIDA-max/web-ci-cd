/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-04-25 16:45:39
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-05-01 14:50:21
 * @FilePath: /React-Ant/src/pages/Pixiv/index.tsx
 * @Description:pixiv页面的主文件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import InfoCard from './components/InfoCard';
import Login from './Login';
import Recommend from './Recommend';
const Pixiv: React.FC = () => {
  const { token } = theme.useToken();
  const { userInfo } = useModel('Pixiv');
  const PageInfo = [
    {
      title: '进行登录(!该功能是最核心的)',
      href: '',
      content: Login,
      index: 1,
      width: '100%',
      isShow: true,
      isUnfold: userInfo.refresh_token ? true : false,
    },
    {
      title: '推荐列表',
      href: '',
      content: Recommend,
      index: 2,
      width: '100%',
      isShow: userInfo.refresh_token ? true : false,
      isUnfold: userInfo.refresh_token ? false : true,
    },
  ];
  const { initialState } = useModel('@@initialState');
  return (
    <div>
      {' '}
      <PageContainer>
        <Card
          style={{
            borderRadius: 8,
          }}
          bodyStyle={{
            backgroundImage:
              initialState?.settings?.navTheme === 'realDark'
                ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          }}
        >
          <div
            style={{
              backgroundPosition: '100% -30%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '274px auto',
              backgroundImage:
                "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: token.colorTextHeading,
              }}
            >
              欢迎使用 Pixiv 页面
            </div>
            <p
              style={{
                fontSize: '14px',
                color: token.colorTextSecondary,
                lineHeight: '22px',
                marginTop: 16,
                marginBottom: 32,
                width: '65%',
              }}
            >
              该页面的功能都是基于用户的账号来进行登录的操作的,是不会提供默认账号的,所以在使用该功能的时候需要自己拥有Pixiv账号,如果有高级会员更佳
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {PageInfo.map((item) => {
                return (
                  <div
                    style={{
                      width: item.width,
                      display: item.isShow ? 'block' : 'none',
                    }}
                    key={item.index}
                  >
                    <InfoCard {...item} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </PageContainer>
    </div>
  );
};
Pixiv.propTypes = {};

export default Pixiv;
