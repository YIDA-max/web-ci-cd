# GitCICD 部署说明

## 技术栈

- 前端：Ant Design Pro（Umi Max）→ `apps/web`
- 后端：NestJS → `apps/server`，端口 **10001**
- 登录：Nest 固定账号（无数据库）+ JWT

## 端口

| 环境 | 前端 | 后端 |
|------|------|------|
| 开发 | **8000**（Umi 会顺带占用 8001 作 HMR，勿与后端冲突） | **10001** |
| 生产 | 静态 `dist`（可用任意静态服务端口） | **10001** |

> 开发勿把前端设为 10000：Umi HMR 会占用 10001，与 Nest 冲突。

## 账号（默认，可在 `apps/server/.env` 改）

| 用户 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | admin |
| user | user123 | user |

## 发版环境配置（打进包内）

正式配置在仓库：`apps/server/config/deploy-envs.json`  
`nest build` / `pnpm build:pack` 都会带上该文件；部署后默认读：

```bash
DEPLOY_ENV_FILE=config/deploy-envs.json
```

（相对 server 启动目录；一般不用改。要覆盖再写绝对路径。）

```json
{
  "environments": [
    {
      "port": "18890",
      "description": "8890 本地环境",
      "staticRoot": "D:/App/nginx-1.28.0/webDev/YIDA/8890/html",
      "backendUrl": "http://127.0.0.1:9999",
      "stripApiPrefix": true
    }
  ]
}
```

`staticRoot` 仍是目标机上的绝对路径（产物拷到哪）。加环境：改 JSON 数组后重启 Nest。

```bash
pnpm install
pnpm --filter @gitcicd/shared build
pnpm --filter server dev     # http://127.0.0.1:10001
pnpm --filter web dev        # http://localhost:8000 ，MOCK=none，/api 代理到 10001
```

浏览器打开 http://localhost:8000 ，用 `admin` / `admin123` 登录。

## 内容站（已并入同一壳）

前端菜单含 Pixiv / 笔趣阁 / 漫画柜 / Mooncell；后端对应 Nest 模块（原 Koa 已重构），路径仍为 `/api/pixiv`、`/api/fiction`、`/api/comics` 等。  
登录仍用 Nest 固定账号。数据库已裁掉，依赖库的能力暂不可用。


```bash
# 静态前端需写死后端地址
UMI_APP_API_URL=http://服务器IP:10001 pnpm build:pack
```

产物目录 `release/`：
- `web/` — 前端静态
- `server/` — Nest + `config/deploy-envs.json`（已打进包）
- `ecosystem.config.cjs` — PM2 示例
