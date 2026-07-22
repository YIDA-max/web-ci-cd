# GitCICD 服务器部署文档

> 部署目标：Linux 服务器，Nginx 路径 `/data/merach/nginx-1.28.0/`
> 发版静态目录：`/data/merach/nginx-1.28.0/webDev/YIDA/8888~8900/html`

---

## 一、服务器环境要求

| 软件 | 版本 | 用途 |
|------|------|------|
| Node.js | >= 20.x | 运行 Next.js + NestJS |
| pnpm | >= 11.x | monorepo 包管理 |
| git | >= 2.x | 发版功能克隆目标仓库 |
| nginx | >= 1.18 | 反向代理 + 静态文件服务 |
| pm2 | 最新 | 进程守护 |

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs git nginx
npm install -g pnpm@11 pm2
```

---

## 二、拉取代码 & 安装构建

```bash
cd /opt
git clone https://github.com/YIDA-max/web-ci-cd.git gitcicd
cd gitcicd

# 安装依赖
pnpm install

# 构建全部（shared → web → server）
NODE_ENV=production pnpm build
```

构建产物：

| 包 | 产物路径 |
|----|---------|
| shared | `packages/shared/dist/` |
| web | `apps/web/.next/` |
| server | `apps/server/dist/` |

---

## 三、环境变量配置

### 3.1 后端 `apps/server/.env`

```bash
# ===== 服务配置 =====
PORT=10001
HOST=127.0.0.1

# ===== Git 工具配置 =====
GIT_TEMP_DIR=.workspace

# ===== 发版部署配置 =====
# 服务器上 Nginx 配置文件路径（发版服务解析它获取环境列表）
DEPLOY_CONF_PATH=/data/merach/nginx-1.28.0/conf/conf.d/webDev.conf
# 构建工作目录
DEPLOY_WORKSPACE=.deploy-workspace
# 构建产物输出目录名
DEPLOY_BUILD_OUTPUT_DIR=html
# 安装依赖命令
DEPLOY_INSTALL_CMD=npm install
# 构建命令
DEPLOY_BUILD_CMD=npm run build
```

### 3.2 前端 `apps/web/.env.production`

```bash
# 发版构建 API 直连后端（绕过 Next.js 代理超时）
NEXT_PUBLIC_API_URL=http://127.0.0.1:10001
```

### 3.3 CORS 配置

修改 `apps/server/src/main.ts`，添加服务器 IP：

```typescript
app.enableCors({
  origin: [
    "http://localhost:10000",
    "http://127.0.0.1:10000",
    "http://192.168.203.161:10000",  // 服务器局域网 IP
  ],
  credentials: true,
});
```

修改后重新构建：`pnpm build`

---

## 四、Nginx 配置

### 4.1 GitCICD 本应用代理

创建 `/data/merach/nginx-1.28.0/conf/conf.d/gitcicd.conf`：

```nginx
server {
    listen 10000;
    server_name localhost;

    # 前端 Next.js
    location / {
        proxy_pass http://127.0.0.1:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API — 10 分钟超时（发版构建耗时长）
    location /api/ {
        proxy_pass http://127.0.0.1:10001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
        proxy_connect_timeout 60s;
    }
}
```

> 如果你不需要 Nginx 再代理一层（PM2 直接跑 10000 端口），可以跳过这一步，直接用 `http://服务器IP:10000` 访问。

### 4.2 发版目标环境配置 `webDev.conf`

这就是 `DEPLOY_CONF_PATH` 指向的文件。你服务器上已有，确保格式如下（发版服务解析 `map $server_port` 块）：

```nginx
# 后端基准地址
map $server_port $backend_url {
    ~^18888$    "http://192.168.200.88:8888";              # 88线上服务
    ~^18889$    "http://192.168.200.89:8888";              # 89线上服务
    ~^18890$    "http://192.168.200.248:9999";             # 黄泽涵服务器
    ~^18891$    "http://192.168.200.97:9999";              # 宦亚服务
    ~^18892$    "http://192.168.200.194:9999";             # 黄泽昌服务器
    ~^18893$    "http://192.168.200.219:9999";             # 肖雅麟服务器
    ~^18894$    "http://192.168.201.45:9999";              # 刘步红服务器
    ~^18895$    "http://192.168.201.174:9999";             # 卢少忠服务器
    ~^18896$    "https://qianyi.merachit.com";             # 生产服务
    ~^18897$    "http://192.168.200.72:9999";              # 姜东服务
    ~^18898$    "http://192.168.200.67:9999";              # 李泓辉服务器
    ~^18899$    "http://192.168.201.89:9999";              # 黄松波服务器
    ~^18900$    "http://192.168.200.180:9999";             # 邓夸夸服务器
    default     "http://192.168.200.88:8888";
}

# 静态资源目录
map $server_port $static_root {
    ~^18888$    "/data/merach/nginx-1.28.0/webDev/YIDA/8888/html";
    ~^18889$    "/data/merach/nginx-1.28.0/webDev/YIDA/8889/html";
    ~^18890$    "/data/merach/nginx-1.28.0/webDev/YIDA/8890/html";
    ~^18891$    "/data/merach/nginx-1.28.0/webDev/YIDA/8891/html";
    ~^18892$    "/data/merach/nginx-1.28.0/webDev/YIDA/8892/html";
    ~^18893$    "/data/merach/nginx-1.28.0/webDev/YIDA/8893/html";
    ~^18894$    "/data/merach/nginx-1.28.0/webDev/YIDA/8894/html";
    ~^18895$    "/data/merach/nginx-1.28.0/webDev/YIDA/8895/html";
    ~^18896$    "/data/merach/nginx-1.28.0/webDev/YIDA/8896/html";
    ~^18897$    "/data/merach/nginx-1.28.0/webDev/YIDA/8897/html";
    ~^18898$    "/data/merach/nginx-1.28.0/webDev/YIDA/8898/html";
    ~^18899$    "/data/merach/nginx-1.28.0/webDev/YIDA/8899/html";
    ~^18900$    "/data/merach/nginx-1.28.0/webDev/YIDA/8900/html";
    default     "/data/merach/nginx-1.28.0/webDev/YIDA/8888/html";
}

# /api 前缀处理
map $server_port $strip_api_prefix {
    ~^18888$    "0";
    ~^18889$    "0";
    ~^18896$    "0";
    default     "1";
}

server {
    listen 18888;
    listen 18889;
    listen 18890;
    listen 18891;
    listen 18892;
    listen 18893;
    listen 18894;
    listen 18895;
    listen 18896;
    listen 18897;
    listen 18898;
    listen 18899;
    listen 18900;

    server_name localhost;

    resolver 114.114.114.114 8.8.8.8 valid=300s;
    resolver_timeout 5s;

    location / {
        root $static_root;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        if ($strip_api_prefix = 1) {
            rewrite ^/api/(.*)$ /$1 break;
        }
        proxy_pass $backend_url;
        proxy_http_version 1.1;
        proxy_set_header Host $proxy_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
        proxy_ssl_session_reuse off;
    }
}
```

> **注意 `$strip_api_prefix` 的值要带引号**（`"0"` / `"1"`），否则发版服务解析器匹配不到。`~^1888[89]$` 要拆成 `~^18888$` 和 `~^18889$` 两行。

---

## 五、PM2 进程管理

### 5.1 创建配置文件

项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'gitcicd-web',
      cwd: '/opt/gitcicd/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 10000',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'gitcicd-server',
      cwd: '/opt/gitcicd/apps/server',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

### 5.2 启动

```bash
cd /opt/gitcicd
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 六、目录权限

```bash
# 项目目录
sudo chown -R www-data:www-data /opt/gitcicd

# 发版目标目录（发版功能要写入构建产物）
sudo chown -R www-data:www-data /data/merach/nginx-1.28.0/webDev/YIDA/

# 临时工作目录
sudo mkdir -p /opt/gitcicd/.deploy-workspace /opt/gitcicd/.workspace
sudo chown -R www-data:www-data /opt/gitcicd/.deploy-workspace /opt/gitcicd/.workspace
```

> `www-data` 替换为你服务器上实际运行 Nginx/PM2 的用户名。可用 `ps aux | grep nginx` 查看。

---

## 七、完整部署步骤（按顺序执行）

```bash
# 1. 拉代码
cd /opt
git clone https://github.com/YIDA-max/web-ci-cd.git gitcicd
cd gitcicd

# 2. 安装依赖
pnpm install

# 3. 创建后端 .env（见第三节 3.1）
vi apps/server/.env

# 4. 创建前端 .env.production（见第三节 3.2）
vi apps/web/.env.production

# 5. 修改 CORS（见第三节 3.3，加服务器 IP）
vi apps/server/src/main.ts

# 6. 构建
NODE_ENV=production pnpm build

# 7. 创建 PM2 配置
vi ecosystem.config.js   # 见第五节

# 8. 设置目录权限（见第六节）

# 9. 启动服务
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 10. 验证
curl http://localhost:10000/                            # 前端页面
curl http://localhost:10001/api/deploy/environments     # 后端 API
```

---

## 八、更新部署

```bash
cd /opt/gitcicd
git pull origin main
pnpm install          # 依赖有变更时
NODE_ENV=production pnpm build
pm2 restart gitcicd-web gitcicd-server
```

---

## 九、常见问题

### Q1: 前端能打开，API 报 Internal Server Error

后端没启动。`pm2 status` 看 `gitcicd-server` 是否 online，`pm2 logs gitcicd-server` 看报错。

### Q2: 发版报 Unexpected token JSON 解析错误

`apps/web/.env.production` 中 `NEXT_PUBLIC_API_URL` 配错，或后端 CORS 没加服务器 IP。

### Q3: 发版构建成功但部署失败 EACCES

PM2 运行用户对 `/data/merach/nginx-1.28.0/webDev/YIDA/` 没有写入权限：
```bash
sudo chown -R www-data:www-data /data/merach/nginx-1.28.0/webDev/YIDA/
```

### Q4: 发版时解析不到环境列表

`apps/server/.env` 中 `DEPLOY_CONF_PATH` 路径不对，或 `webDev.conf` 中 map 值没带引号。

### Q5: 发版时 npm install 失败

服务器 Node.js 版本太低，或 PM2 运行用户没有执行权限。确保 `node -v` >= 20。

---

## 十、架构图

```
用户浏览器
    │
    ▼
┌──────────────────────────────────────────┐
│  Nginx (:10000)                          │
│  ├─ /        → Next.js (:10000)          │
│  └─ /api/    → NestJS (:10001)           │
│     (proxy_read_timeout 600s)            │
└──────────────────────────────────────────┘
    │                    │
    ▼                    ▼
┌──────────┐    ┌──────────────────────────────┐
│ Next.js  │    │  NestJS (:10001)              │
│ (:10000) │    │  ├─ Git 合并功能              │
│ 生产构建  │    │  └─ 发版部署功能              │
└──────────┘    │     ├─ clone 仓库             │
                │     ├─ npm install            │
                │     ├─ npm run build          │
                │     └─ 复制到 Nginx 静态目录   │
                └──────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────────────────┐
              │ /data/merach/nginx-1.28.0/      │
              │   webDev/YIDA/                   │
              │     8888/html  (:18888)         │
              │     8889/html  (:18889)         │
              │     8890/html  (:18890)         │
              │     ...                         │
              │     8900/html  (:18900)         │
              └─────────────────────────────────┘
```
