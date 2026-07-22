# GitCICD 服务器部署文档

## 一、服务器环境要求

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | >= 20.x | 运行 Next.js + NestJS |
| pnpm | >= 9.x | 包管理（monorepo 依赖） |
| git | >= 2.x | 发版功能克隆目标仓库 |
| nginx | >= 1.18 | 反向代理 + 静态文件服务 |

```bash
# Ubuntu / Debian 安装示例
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs git nginx

# 安装 pnpm
npm install -g pnpm@11
```

## 二、代码准备

### 方式 A：服务器直接 clone（推荐）

```bash
cd /opt
git clone https://github.com/YIDA-max/web-ci-cd.git gitcicd
cd gitcicd
```

### 方式 B：本地打包上传

```bash
# 本地执行（排除不需要的目录）
cd D:\gitCICD
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='.workspace' \
    --exclude='.deploy-workspace' \
    --exclude='.git' \
    -czf gitcicd.tar.gz .

# 上传到服务器
scp gitcicd.tar.gz user@your-server:/opt/

# 服务器解压
ssh user@your-server
mkdir -p /opt/gitcicd && cd /opt/gitcicd
tar -xzf /opt/gitcicd.tar.gz
```

## 三、安装依赖 & 构建

```bash
cd /opt/gitcicd

# 安装依赖
pnpm install

# 构建所有包（shared → web → server）
pnpm build
```

构建产物：

| 包 | 产物路径 | 说明 |
|----|---------|------|
| shared | `packages/shared/dist/` | TypeScript 编译输出 |
| web | `apps/web/.next/` | Next.js 生产构建 |
| server | `apps/server/dist/` | NestJS 编译输出 |

## 四、环境变量配置

### 4.1 后端配置 `apps/server/.env`

```bash
# ===== 服务配置 =====
PORT=3001
HOST=127.0.0.1

# ===== Git 工具配置 =====
GIT_TEMP_DIR=.workspace

# ===== 发版部署配置 =====
# Nginx 配置文件路径（Linux 服务器示例）
DEPLOY_CONF_PATH=/etc/nginx/conf.d/webDev.conf
# 构建工作目录
DEPLOY_WORKSPACE=.deploy-workspace
# 构建产物输出目录名
DEPLOY_BUILD_OUTPUT_DIR=html
# 安装依赖命令
DEPLOY_INSTALL_CMD=npm install
# 构建命令
DEPLOY_BUILD_CMD=npm run build
```

> **注意**：`DEPLOY_CONF_PATH` 必须指向服务器上实际的 Nginx 配置文件路径，发版功能会解析它来获取部署环境列表。

### 4.2 前端配置 `apps/web/.env.production`

```bash
# 发版构建 API 直连后端地址（绕过 Next.js 代理超时）
# 如果前端和后端在同一服务器，用 127.0.0.1
# 如果前端通过 Nginx 代理后端，用实际域名
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

构建时需要指定生产环境：

```bash
NODE_ENV=production pnpm build
```

### 4.3 CORS 配置修改

需要修改 `apps/server/src/main.ts` 中的 CORS 配置，允许生产域名访问：

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // 添加你的生产域名或 IP
    'http://your-server-ip:3000',
    'https://your-domain.com',
  ],
  credentials: true,
});
```

修改后需要重新构建：`pnpm build`

## 五、Nginx 反向代理配置

### 5.1 主应用 Nginx 配置

创建 `/etc/nginx/conf.d/gitcicd.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 或服务器 IP

    # 前端 Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API — 加长超时（发版构建耗时 2-5 分钟）
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 关键：构建部署接口耗时长，必须加长超时
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
        proxy_connect_timeout 60s;
    }
}
```

### 5.2 发版目标环境 Nginx 配置

这就是 `DEPLOY_CONF_PATH` 指向的文件，发版功能会解析其中的 `map $server_port` 块。

示例 `/etc/nginx/conf.d/webDev.conf`：

```nginx
map $server_port $backend_upstream {
    default  http://127.0.0.1:9999;
    18889    http://127.0.0.1:8890;
    18890    http://127.0.0.1:8891;
    18891    http://127.0.0.1:8892;
    # ... 更多环境
}

map $server_port $static_root {
    default  /var/www/default/html;
    18889    /var/www/YIDA/8889/html;
    18890    /var/www/YIDA/8890/html;
    18891    /var/www/YIDA/8891/html;
    # ... 更多环境
}

map $server_port $env_description {
    default  "默认环境";
    18889    "89线上服务";
    18890    "90测试环境";
    18891    "91预发环境";
    # ... 更多环境
}

server {
    listen 18889;
    location / {
        root /var/www/YIDA/8889/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 18890;
    location / {
        root /var/www/YIDA/8890/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# ... 更多 server 块
```

## 六、进程管理（PM2）

### 6.1 安装 PM2

```bash
npm install -g pm2
```

### 6.2 创建 PM2 配置文件

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'gitcicd-web',
      cwd: '/opt/gitcicd/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
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

### 6.3 启动服务

```bash
cd /opt/gitcicd

# 启动所有服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 设置开机自启
pm2 save
pm2 startup
```

## 七、目录权限

```bash
# 确保运行用户有权限访问项目目录
sudo chown -R www-data:www-data /opt/gitcicd

# 发版功能需要写入部署目标目录
sudo mkdir -p /var/www/YIDA
sudo chown -R www-data:www-data /var/www/YIDA

# 发版工作目录会临时 clone 仓库
sudo mkdir -p /opt/gitcicd/.deploy-workspace
sudo chown -R www-data:www-data /opt/gitcicd/.deploy-workspace

# Git 工具临时目录
sudo mkdir -p /opt/gitcicd/.workspace
sudo chown -R www-data:www-data /opt/gitcicd/.workspace
```

## 八、完整部署流程（汇总）

```bash
# 1. 拉取代码
cd /opt
git clone https://github.com/YIDA-max/web-ci-cd.git gitcicd
cd gitcicd

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp apps/server/.env.example apps/server/.env   # 如有 example
# 或手动创建 apps/server/.env（见第四节）
# 手动创建 apps/web/.env.production（见第四节）

# 4. 修改 CORS 配置（如需要）
# 编辑 apps/server/src/main.ts 添加生产域名

# 5. 构建
NODE_ENV=production pnpm build

# 6. 配置 Nginx
sudo cp /path/to/gitcicd.conf /etc/nginx/conf.d/
sudo nginx -t
sudo nginx -s reload

# 7. 启动服务
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 8. 验证
curl http://localhost:3000/          # 前端
curl http://localhost:3001/api/deploy/environments  # 后端
```

## 九、更新部署

```bash
cd /opt/gitcicd

# 拉取最新代码
git pull origin main

# 重新安装依赖（如有变更）
pnpm install

# 重新构建
NODE_ENV=production pnpm build

# 重启服务
pm2 restart gitcicd-web gitcicd-server
```

## 十、常见问题

### Q1: 前端页面能打开，但 API 报错 "Internal Server Error"

检查后端是否运行：`pm2 status`，看 `gitcicd-server` 是否 online。
查看后端日志：`pm2 logs gitcicd-server`

### Q2: 发版功能报 "Unexpected token" JSON 解析错误

确保 `apps/web/.env.production` 中的 `NEXT_PUBLIC_API_URL` 配置正确，且后端 CORS 允许该地址访问。

### Q3: 发版构建成功但部署失败 "EACCES"

运行用户对 Nginx 静态目录没有写入权限。执行：
```bash
sudo chown -R www-data:www-data /var/www/YIDA
```

### Q4: 发版时 npm install 失败

确保服务器安装了 Node.js（>= 16）和 npm，并且 PM2 运行用户有权限在 `.deploy-workspace` 目录下执行命令。

### Q5: Nginx 解析不到部署环境

确保 `apps/server/.env` 中的 `DEPLOY_CONF_PATH` 指向正确的 Nginx 配置文件路径，且该文件包含 `map $server_port` 块。

## 十一、架构图

```
用户浏览器
    │
    ▼
┌─────────────────────────────────┐
│  Nginx (:80)                    │
│  ├─ /        → Next.js (:3000)  │
│  └─ /api/    → NestJS (:3001)   │
│     (proxy_read_timeout 600s)   │
└─────────────────────────────────┘
    │                    │
    ▼                    ▼
┌──────────┐    ┌──────────────────────┐
│ Next.js  │    │  NestJS (:3001)      │
│ (:3000)  │    │  ├─ Git 合并功能     │
│ 生产构建  │    │  └─ 发版部署功能     │
└──────────┘    │     ├─ clone 仓库    │
                │     ├─ npm install   │
                │     ├─ npm run build │
                │     └─ 复制到 Nginx  │
                │        静态目录      │
                └──────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Nginx (:18889) │ ← 发版目标环境
                │ Nginx (:18890) │
                │ Nginx (:18891) │
                │ ...            │
                └────────────────┘
```
