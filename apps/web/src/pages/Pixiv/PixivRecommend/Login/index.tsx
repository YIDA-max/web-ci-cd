/*
 * Pixiv Login
 */
import { Recommend } from '@/api/Pixiv';
import KeyWord from '@/components/KeyWord';
import { getPixivLocalStorage } from '@/utils/localStorage';
import sha256 from 'js-sha256';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useModel } from '@umijs/max';
import { common } from '../utils/common';
import enums from '../utils/constants/enums';
import UrlPixivInput from './UrlPixivInput';

const code_verifier = common.tokenBase64(32);
const code_challenge = (() => {
  const bytes = new Uint8Array(sha256.arrayBuffer(code_verifier));
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
})();

const LOGIN_PARAMS = {
  code_challenge,
  code_challenge_method: 'S256',
  client: 'pixiv-android',
};

const Login: React.FC = () => {
  const { userInfo, setuserInfo } = useModel('Pixiv');

  useEffect(() => {
    const info = async () => {
      const data = await getPixivLocalStorage('pixivInfo');
      if (data) {
        setuserInfo(data);
      }
    };
    info();
  }, [setuserInfo]);

  return (
    <div>
      <h2>
        {userInfo.refresh_token ? (
          <span
            style={{ color: 'green' }}
            onClick={async () => {
              await Recommend({ ...userInfo, expire_time: 3600 });
            }}
          >
            ???
          </span>
        ) : (
          <span style={{ color: 'red' }}>???</span>
        )}
      </h2>
      <h4>
        ?? Pixiv ?????????????????????????
      </h4>
      <h4>
        1.????? URL ???????????????????
        <a
          href={`${enums.API_BASE_URL}/web/v1/login?${new URLSearchParams(
            LOGIN_PARAMS,
          ).toString()}`}
          target="_blank"
          rel="noreferrer"
        >
          ???????{'>'}
        </a>
      </h4>
      <h4>
        3:??
        <KeyWord keyWord="???" explain="? F12 ????????????" />
        ????????? pixiv://... ???
      </h4>
      <h4>
        4:???????????????
        <br />
        <UrlPixivInput code_verifier={code_verifier} />
      </h4>
      <h4>5:????????????????????</h4>
      <h4>6:??????:{userInfo?.user?.name}</h4>
    </div>
  );
};

Login.propTypes = {
  name: PropTypes.string,
  message: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

export default Login;
