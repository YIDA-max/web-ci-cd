const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "../apps/web/src/pages/Pixiv/PixivRecommend/Login/index.tsx",
);

const content = `/*
 * Pixiv Login
 */
import { Recommend } from '@/api/Pixiv';
import KeyWord from '@/components/KeyWord';
import { getPixivLocalStorage } from '@/utils/localStorage';
import { sha256 } from 'js-sha256';
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
  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
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
            {\u5df2\u767b\u5f55}
          </span>
        ) : (
          <span style={{ color: 'red' }}>{\u672a\u767b\u5f55}</span>
        )}
      </h2>
      <h4>
        {\u7531\u4e8e} Pixiv {\u5b98\u7f51\u8fdb\u884c\u4e86\u767b\u5f55\u9650\u5236\uff0c\u6240\u4ee5\u9700\u8981\u81ea\u5df1\u624b\u52a8\u83b7\u53d6\u6240\u9700\u4fe1\u606f\uff1a}
      </h4>
      <h4>
        1.{\u8bf7\u5c06\u4e0b\u9762\u7684} URL {\u590d\u5236\u5230\u6d4f\u89c8\u5668\uff0c\u7136\u540e\u50cf\u5f80\u5e38\u4e00\u6837\u7ee7\u7eed\u767b\u5f55\uff1a}
        <a
          href={\`\${enums.API_BASE_URL}/web/v1/login?\${new URLSearchParams(
            LOGIN_PARAMS,
          ).toString()}\`}
          target="_blank"
          rel="noreferrer"
        >
          {\u70b9\u6211\u53bb\u8fdb\u884c\u767b\u5f55}{'>'}
        </a>
      </h4>
      <h4>
        3:{\u6253\u5f00}
        <KeyWord keyWord="{\u63a7\u5236\u53f0}" explain="{\u6309} F12 {\u952e\u53ef\u4ee5\u6253\u5f00\u6d4f\u89c8\u5668\u7684\u63a7\u5236\u53f0}" />
        {\u8fdb\u884c\u767b\u5f55\u4e4b\u540e\u83b7\u53d6\u5230} pixiv://... {\u7684\u94fe\u63a5}
      </h4>
      <h4>
        4:{\u8f93\u5165\u4f60\u62ff\u5230\u7684\u94fe\u63a5\uff0c\u8fc7\u7a0b\u5c3d\u91cf\u8981\u5feb}
        <br />
        <UrlPixivInput code_verifier={code_verifier} />
      </h4>
      <h4>5:{\u5982\u679c\u8f93\u5165\u6b63\u786e\uff0c\u90a3\u4e48\u5c31\u4f1a\u8fdb\u884c\u63d0\u793a\u8bf4\u767b\u5f55\u6210\u529f}</h4>
      <h4>6:{\u4f60\u7684\u8d26\u53f7\u540d\u5b57}:{userInfo?.user?.name}</h4>
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
`;

// The above mistakenly used JSX {unicode} - write proper decoded Chinese instead
const proper = content
  .replace(/\{\\u([0-9a-fA-F]{4})\}/g, (_, h) => JSON.parse(`"\\u${h}"`))
  .replace(/"\{\\u([0-9a-fA-F]{4})/g, (_, h) => `"${JSON.parse(`"\\u${h}"`)}`);

// Simpler: write via Buffer from unicode escapes in a template without JSX braces
const src = [
  "/*",
  " * Pixiv Login",
  " */",
  "import { Recommend } from '@/api/Pixiv';",
  "import KeyWord from '@/components/KeyWord';",
  "import { getPixivLocalStorage } from '@/utils/localStorage';",
  "import { sha256 } from 'js-sha256';",
  "import PropTypes from 'prop-types';",
  "import React, { useEffect } from 'react';",
  "import { useModel } from '@umijs/max';",
  "import { common } from '../utils/common';",
  "import enums from '../utils/constants/enums';",
  "import UrlPixivInput from './UrlPixivInput';",
  "",
  "const code_verifier = common.tokenBase64(32);",
  "const code_challenge = (() => {",
  "  const bytes = new Uint8Array(sha256.arrayBuffer(code_verifier));",
  "  let bin = '';",
  "  bytes.forEach((b) => {",
  "    bin += String.fromCharCode(b);",
  "  });",
  "  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');",
  "})();",
  "",
  "const LOGIN_PARAMS = {",
  "  code_challenge,",
  "  code_challenge_method: 'S256',",
  "  client: 'pixiv-android',",
  "};",
  "",
  "const Login: React.FC = () => {",
  "  const { userInfo, setuserInfo } = useModel('Pixiv');",
  "",
  "  useEffect(() => {",
  "    const info = async () => {",
  "      const data = await getPixivLocalStorage('pixivInfo');",
  "      if (data) {",
  "        setuserInfo(data);",
  "      }",
  "    };",
  "    info();",
  "  }, [setuserInfo]);",
  "",
  "  return (",
  "    <div>",
  "      <h2>",
  "        {userInfo.refresh_token ? (",
  "          <span",
  "            style={{ color: 'green' }}",
  "            onClick={async () => {",
  "              await Recommend({ ...userInfo, expire_time: 3600 });",
  "            }}",
  "          >",
  "            " + "\u5df2\u767b\u5f55",
  "          </span>",
  "        ) : (",
  "          <span style={{ color: 'red' }}>" + "\u672a\u767b\u5f55" + "</span>",
  "        )}",
  "      </h2>",
  "      <h4>",
  "        " + "\u7531\u4e8e Pixiv \u5b98\u7f51\u8fdb\u884c\u4e86\u767b\u5f55\u9650\u5236\uff0c\u6240\u4ee5\u9700\u8981\u81ea\u5df1\u624b\u52a8\u83b7\u53d6\u6240\u9700\u4fe1\u606f\uff1a",
  "      </h4>",
  "      <h4>",
  "        1." + "\u8bf7\u5c06\u4e0b\u9762\u7684 URL \u590d\u5236\u5230\u6d4f\u89c8\u5668\uff0c\u7136\u540e\u50cf\u5f80\u5e38\u4e00\u6837\u7ee7\u7eed\u767b\u5f55\uff1a",
  "        <a",
  "          href={`${enums.API_BASE_URL}/web/v1/login?${new URLSearchParams(",
  "            LOGIN_PARAMS,",
  "          ).toString()}`}",
  "          target=\"_blank\"",
  "          rel=\"noreferrer\"",
  "        >",
  "          " + "\u70b9\u6211\u53bb\u8fdb\u884c\u767b\u5f55" + "{'>'}",
  "        </a>",
  "      </h4>",
  "      <h4>",
  "        3:" + "\u6253\u5f00",
  "        <KeyWord keyWord=\"" + "\u63a7\u5236\u53f0" + "\" explain=\"" + "\u6309 F12 \u952e\u53ef\u4ee5\u6253\u5f00\u6d4f\u89c8\u5668\u7684\u63a7\u5236\u53f0" + "\" />",
  "        " + "\u8fdb\u884c\u767b\u5f55\u4e4b\u540e\u83b7\u53d6\u5230 pixiv://... \u7684\u94fe\u63a5",
  "      </h4>",
  "      <h4>",
  "        4:" + "\u8f93\u5165\u4f60\u62ff\u5230\u7684\u94fe\u63a5\uff0c\u8fc7\u7a0b\u5c3d\u91cf\u8981\u5feb",
  "        <br />",
  "        <UrlPixivInput code_verifier={code_verifier} />",
  "      </h4>",
  "      <h4>5:" + "\u5982\u679c\u8f93\u5165\u6b63\u786e\uff0c\u90a3\u4e48\u5c31\u4f1a\u8fdb\u884c\u63d0\u793a\u8bf4\u767b\u5f55\u6210\u529f" + "</h4>",
  "      <h4>6:" + "\u4f60\u7684\u8d26\u53f7\u540d\u5b57" + ":{userInfo?.user?.name}</h4>",
  "    </div>",
  "  );",
  "};",
  "",
  "Login.propTypes = {",
  "  name: PropTypes.string,",
  "  message: PropTypes.shape({",
  "    subject: PropTypes.string,",
  "    body: PropTypes.string,",
  "  }),",
  "  onClick: PropTypes.func,",
  "};",
  "",
  "export default Login;",
  "",
].join("\n");

fs.writeFileSync(file, src, "utf8");
const verify = fs.readFileSync(file, "utf8");
console.log({
  loggedIn: verify.includes("\u5df2\u767b\u5f55"),
  notLoggedIn: verify.includes("\u672a\u767b\u5f55"),
  sha: verify.includes("js-sha256"),
});
