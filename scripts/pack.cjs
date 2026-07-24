/**
 * 打包可部署产物到 release/
 * - web: umi dist
 * - server: dist + node_modules(prod) + config/deploy-envs.json
 *
 *   pnpm build:pack
 */
const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const RELEASE = path.join(ROOT, "release");
const IS_WIN = process.platform === "win32";

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function cpDir(src, dest) {
  if (!fs.existsSync(src)) throw new Error(`缺少目录: ${src}`);
  ensureDir(dest);
  if (IS_WIN) {
    const r = spawnSync(
      "robocopy",
      [src, dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/R:1", "/W:1"],
      { stdio: "inherit", shell: true },
    );
    const code = r.status ?? 1;
    if (code >= 8) throw new Error(`robocopy 失败 code=${code}`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, dereference: true });
}

function cpFile(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function main() {
  const webDist = path.join(ROOT, "apps/web/dist");
  const serverDist = path.join(ROOT, "apps/server/dist/main.js");
  if (!fs.existsSync(webDist)) {
    throw new Error("缺少 apps/web/dist，请先 pnpm --filter web build");
  }
  if (!fs.existsSync(serverDist)) {
    throw new Error("缺少 apps/server/dist，请先 pnpm --filter server build");
  }

  console.log("→ 清理 release/");
  rmrf(RELEASE);
  ensureDir(RELEASE);

  const webOut = path.join(RELEASE, "web");
  console.log("→ 打包 web (dist)");
  cpDir(webDist, webOut);

  const serverOut = path.join(RELEASE, "server");
  console.log("→ 打包 server (pnpm deploy)");
  ensureDir(serverOut);
  execSync(`pnpm --filter=server deploy --prod --legacy "${serverOut}"`, {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, CI: "true" },
  });

  // 强制带上环境配置（deploy 可能漏掉 config）
  console.log("→ 写入 config/deploy-envs.json");
  cpDir(
    path.join(ROOT, "apps/server/config"),
    path.join(serverOut, "config"),
  );
  cpFile(
    path.join(ROOT, "apps/server/.env.example"),
    path.join(serverOut, ".env.example"),
  );
  cpFile(path.join(ROOT, "apps/server/.env"), path.join(serverOut, ".env"));

  // 保证 .env 指向包内相对路径
  const envPath = path.join(serverOut, ".env");
  if (fs.existsSync(envPath)) {
    let envText = fs.readFileSync(envPath, "utf-8");
    if (!/^DEPLOY_ENV_FILE=/m.test(envText)) {
      envText += `\nDEPLOY_ENV_FILE=config/deploy-envs.json\n`;
    } else {
      envText = envText.replace(
        /^DEPLOY_ENV_FILE=.*$/m,
        "DEPLOY_ENV_FILE=config/deploy-envs.json",
      );
    }
    fs.writeFileSync(envPath, envText);
  }

  fs.writeFileSync(
    path.join(RELEASE, "ecosystem.config.cjs"),
    `const path = require("path");

module.exports = {
  apps: [
    {
      name: "gitcicd-server",
      cwd: path.join(__dirname, "server"),
      script: "dist/main.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 10001,
        HOST: "0.0.0.0",
        DEPLOY_ENV_FILE: "config/deploy-envs.json",
      },
    },
    {
      name: "gitcicd-web",
      cwd: path.join(__dirname, "web"),
      script: "npx",
      args: "serve -s . -l 8000",
      interpreter: "none",
      env: { NODE_ENV: "production" },
    },
  ],
};
`,
  );

  fs.writeFileSync(
    path.join(RELEASE, "README.txt"),
    `GitCICD 产物

1. 拷贝整个 release 到服务器
2. 按需改 server/config/deploy-envs.json（环境列表已打进包内）
3. 按需改 server/.env
4. 前端静态：可用任意静态服务器托管 web/
5. 后端：cd server && node dist/main.js
   或：pm2 start ecosystem.config.cjs

发版环境配置默认：server/config/deploy-envs.json
`,
  );

  console.log("\n✓ 完成 →", RELEASE);
  console.log("  环境配置已包含: server/config/deploy-envs.json");
}

main();
