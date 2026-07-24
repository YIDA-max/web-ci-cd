import { useState } from 'react';

export default () => {
  const [userInfo, setuserInfo] = useState<{
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
    user: {
      profile_image_urls: {
        px_16x16: string;
        px_50x50: string;
        px_170x170: string;
      };
      id: string;
      name: string;
      account: string;
      mail_address: string;
      is_premium: boolean;
      x_restrict: number;
      is_mail_authorized: boolean;
      require_policy_agreement: boolean;
    };
    response: {
      access_token: string;
      expires_in: number;
      token_type: string;
      scope: string;
      refresh_token: string;
      user: {
        profile_image_urls: {
          px_16x16: string;
          px_50x50: string;
          px_170x170: string;
        };
        id: string;
        name: string;
        account: string;
        mail_address: string;
        is_premium: boolean;
        x_restrict: number;
        is_mail_authorized: boolean;
        require_policy_agreement: boolean;
      };
    };
  }>({
    access_token: '',
    expires_in: 3600,
    token_type: 'bearer',
    scope: '',
    refresh_token: '',
    user: {
      profile_image_urls: {
        px_16x16: 'https://s.pximg.net/common/images/no_profile_ss.png',
        px_50x50: 'https://s.pximg.net/common/images/no_profile_s.png',
        px_170x170: 'https://s.pximg.net/common/images/no_profile.png',
      },
      id: '35012676',
      name: '寒山寺',
      account: 'user_pxgk4287',
      mail_address: '3136271519@qq.com',
      is_premium: true,
      x_restrict: 2,
      is_mail_authorized: true,
      require_policy_agreement: false,
    },
    response: {
      access_token: '',
      expires_in: 3600,
      token_type: 'bearer',
      scope: '',
      refresh_token: '',
      user: {
        profile_image_urls: {
          px_16x16: 'https://s.pximg.net/common/images/no_profile_ss.png',
          px_50x50: 'https://s.pximg.net/common/images/no_profile_s.png',
          px_170x170: 'https://s.pximg.net/common/images/no_profile.png',
        },
        id: '35012676',
        name: '寒山寺',
        account: 'user_pxgk4287',
        mail_address: '3136271519@qq.com',
        is_premium: true,
        x_restrict: 2,
        is_mail_authorized: true,
        require_policy_agreement: false,
      },
    },
  });
  return { userInfo, setuserInfo };
};
