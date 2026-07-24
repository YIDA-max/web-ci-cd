const fs = require("fs");
const path = require("path");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".ts")) a.push(p);
  }
  return a;
}

function relImport(fromDir, targetFile) {
  let rel = path.relative(fromDir, targetFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel.replace(/\.ts$/, "");
}

const root = path.join(__dirname, "../apps/server/src");
const files = walk(root);

for (const f of files) {
  if (f.includes(`${path.sep}shims${path.sep}koa-router`)) continue;
  let c = fs.readFileSync(f, "utf8");
  let n = c;
  const dir = path.dirname(f);
  const ctx = relImport(dir, path.join(root, "content-shared/router-context.ts"));
  n = n.replace(
    /import \{ RouterContext \} from ["']koa-router["'];/g,
    `import { RouterContext } from '${ctx}';`,
  );
  n = n.replace(/from ["']@\/utils\/File\/down["']/g, () => {
    return `from '${relImport(dir, path.join(root, "content-shared/utils/File/down.ts"))}'`;
  });
  n = n.replace(/from ["']@\/utils\/File\/base64["']/g, () => {
    return `from '${relImport(dir, path.join(root, "content-shared/utils/File/base64.ts"))}'`;
  });
  n = n.replace(/from ["']@\/utils\/File\/fileRoot["']/g, () => {
    return `from '${relImport(dir, path.join(root, "content-shared/utils/File/fileRoot.ts"))}'`;
  });
  n = n.replace(/import \{ connect \} from ["']DB\/index["'];\r?\n?/g, "");
  n = n.replace(
    /import \{ jwtUtils \} from ["']@\/utils\/token\/token["'];\r?\n?/g,
    "",
  );
  if (n !== c) {
    fs.writeFileSync(f, n, "utf8");
    console.log("patched", path.relative(process.cwd(), f));
  }
}
