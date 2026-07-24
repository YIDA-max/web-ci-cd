const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const tmp = path.join(__dirname, "../.tmp-react-ant");
if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });
execSync(`git clone --depth 1 https://github.com/YIDA-max/React-Ant.git "${tmp}"`, {
  stdio: "inherit",
});

const src = path.join(
  tmp,
  "src/pages/Pixiv/PixivRecommend/Login/index.tsx",
);
const dst = path.join(
  __dirname,
  "../apps/web/src/pages/Pixiv/PixivRecommend/Login/index.tsx",
);
let text = fs.readFileSync(src, "utf8");
text = text.replace(/from ['"]umi['"]/g, "from '@umijs/max'");
// Node crypto → 浏览器可用的 js-sha256
text = text.replace(
  "import crypto from 'crypto';\n",
  "import { sha256 } from 'js-sha256';\n",
);
text = text.replace(
  `let code_challenge = crypto
  .createHash('sha256')
  .update(code_verifier)
  .digest('base64')
  .split('/')
  .join('_')
  .split('+')
  .join('-')
  .split('=')
  .join('');`,
  `let code_challenge = sha256
  .arrayBuffer(code_verifier)
  .reduce((b64, byte, i, arr) => {
    // produce base64url from bytes
    return b64;
  }, '');
// base64url(sha256(verifier))
code_challenge = (() => {
  const bytes = new Uint8Array(sha256.arrayBuffer(code_verifier));
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
})();`,
);

fs.writeFileSync(dst, text, "utf8");
console.log("restored", dst);
console.log("未登录", text.includes("未登录"));
fs.rmSync(tmp, { recursive: true, force: true });
