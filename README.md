# Web CI/CD — Git 分支批量合并工具

企业级 Git 分支批量合并工具，基于 Turborepo Monorepo 架构。

## 技术栈

| 模块 | 技术 |
|------|------|
| **前端** | Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui |
| **后端** | NestJS + simple-git |
| **Monorepo** | Turborepo + pnpm workspace |
| **共享类型** | `@gitcicd/shared` 内部包 |
| **动画** | Framer Motion |
| **主题** | next-themes（暗色/亮色） |

## 项目结构

```
├── apps/
│   ├── web/          # Next.js 前端（端口 3000）
│   └── server/       # NestJS 后端（端口 3001）
├── packages/
│   └── shared/       # 共享 TypeScript 类型定义
├── .workspace/       # Git 操作临时目录（不纳入版本控制）
├── turbo.json
└── pnpm-workspace.yaml
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 同时启动前后端开发服务器
pnpm dev

# 或单独启动
pnpm dev --filter @gitcicd/web    # 前端
pnpm dev --filter @gitcicd/server # 后端
```

前端: http://localhost:3000
后端: http://localhost:3001

## 功能

- 输入 Git 仓库地址，自动同步远程分支
- 选择源分支，批量合并到多个目标分支
- 实时显示合并结果（成功/失败/冲突）
- 暗色/亮色主题切换
- 三步式引导流程

## 注意事项

- `.workspace/` 目录用于 Git 操作隔离，已在 `.gitignore` 中排除
- 确保有足够的权限访问目标 Git 仓库
- 合并前会自动排除 master 分支
