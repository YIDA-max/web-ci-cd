import type {
  SyncBranchesResponse,
  MergeBranchesRequest,
  MergeBranchesResponse,
  CleanupResponse,
  DeployEnvironmentsResponse,
  DeployBuildRequest,
  DeployBuildResponse,
} from "@gitcicd/shared";

/**
 * 后端直连地址 — 用于耗时较长的 API（如发版构建），
 * 绕过 Next.js rewrite 代理的默认超时限制。
 * 生产环境可通过 NEXT_PUBLIC_API_URL 覆盖。
 */
const DIRECT_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10001";

/** 10 分钟超时（发版构建包含 npm install + npm run build，耗时长） */
const TEN_MINUTES = 10 * 60 * 1000;

function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeout = TEN_MINUTES,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

export async function syncBranches(
  repoUrl: string,
): Promise<SyncBranchesResponse> {
  const res = await fetchWithTimeout("/api/git/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });
  return res.json();
}

export async function mergeBranches(
  data: MergeBranchesRequest,
): Promise<MergeBranchesResponse> {
  const res = await fetchWithTimeout("/api/git/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function cleanup(tempDir: string): Promise<CleanupResponse> {
  const res = await fetchWithTimeout("/api/git/cleanup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempDir }),
  });
  return res.json();
}

// ===== Deploy API =====

export async function getDeployEnvironments(): Promise<DeployEnvironmentsResponse> {
  const res = await fetchWithTimeout("/api/deploy/environments");
  return res.json();
}

export async function deployBuild(
  data: DeployBuildRequest,
): Promise<DeployBuildResponse> {
  const res = await fetchWithTimeout(
    `${DIRECT_API_BASE}/api/deploy/build`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return res.json();
}
