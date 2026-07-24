const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const tmp = path.join(__dirname, "../.tmp-react-ant");
const dst = path.join(__dirname, "../apps/web/src");

if (!fs.existsSync(tmp)) {
  execSync(
    `git clone --depth 1 https://github.com/YIDA-max/React-Ant.git "${tmp}"`,
    { stdio: "inherit" },
  );
}

function robocopy(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  try {
    execSync(
      `robocopy "${src}" "${dest}" /E /NFL /NDL /NJH /NJS /nc /ns /np`,
      { stdio: "inherit", windowsHide: true },
    );
  } catch (e) {
    // robocopy: 0-7 = success-ish
    if (!e.status || e.status >= 8) throw e;
  }
}

const src = path.join(tmp, "src");
robocopy(path.join(src, "pages/Pixiv"), path.join(dst, "pages/Pixiv"));
robocopy(path.join(src, "pages/Fiction"), path.join(dst, "pages/Fiction"));
robocopy(path.join(src, "pages/comics"), path.join(dst, "pages/comics"));
robocopy(path.join(src, "pages/Mooncell"), path.join(dst, "pages/Mooncell"));
robocopy(path.join(src, "api"), path.join(dst, "api"));
robocopy(path.join(src, "utils"), path.join(dst, "utils/content"));
robocopy(path.join(src, "models"), path.join(dst, "models"));
robocopy(path.join(src, "components/KeyWord"), path.join(dst, "components/KeyWord"));
robocopy(
  path.join(src, "components/head-portrait"),
  path.join(dst, "components/head-portrait"),
);

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) a.push(p);
  }
  return a;
}

for (const r of [
  path.join(dst, "pages/Pixiv"),
  path.join(dst, "pages/Fiction"),
  path.join(dst, "pages/comics"),
  path.join(dst, "pages/Mooncell"),
]) {
  for (const f of walk(r)) {
    const c = fs.readFileSync(f, "utf8");
    const n = c.replace(/from ['"]umi['"]/g, "from '@umijs/max'");
    if (n !== c) {
      fs.writeFileSync(f, n, "utf8");
      console.log("umi", path.relative(process.cwd(), f));
    }
  }
}

fs.writeFileSync(
  path.join(dst, "utils/request.ts"),
  "export { request } from './content/request';\n",
  "utf8",
);
fs.writeFileSync(
  path.join(dst, "utils/localStorage.ts"),
  "export * from './content/localStorage';\n",
  "utf8",
);
fs.writeFileSync(
  path.join(dst, "utils/scrollToTop.ts"),
  "export * from './content/scrollToTop';\n",
  "utf8",
);
fs.writeFileSync(
  path.join(dst, "utils/window.ts"),
  "export * from './content/window';\n",
  "utf8",
);

fs.writeFileSync(
  path.join(dst, "utils/content/request.ts"),
  `import { message, notification } from 'antd';
import { history } from '@umijs/max';
import { extend } from 'umi-request';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: \`请求错误 \${status}: \${url}\`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '网络异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

export const request = extend({
  prefix: '/api',
  timeout: 600000,
  errorHandler,
});

request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token') || '';
  return {
    url,
    options: {
      ...options,
      interceptors: true,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
      },
    },
  };
});

request.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    message.error('登录超时，请重新登陆!');
    history.push('/user/login');
  }
  return response;
});
`,
  "utf8",
);

const login = fs.readFileSync(
  path.join(dst, "pages/Pixiv/PixivRecommend/Login/index.tsx"),
  "utf8",
);
console.log("has未登录", login.includes("未登录"));
console.log("has@umijs/max", login.includes("@umijs/max"));

fs.rmSync(tmp, { recursive: true, force: true });
console.log("done");
