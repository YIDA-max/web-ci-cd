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
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function syncBranches(
  repoUrl: string,
): Promise<SyncBranchesResponse> {
  const res = await fetch("/api/git/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });
  return res.json();
}

export async function mergeBranches(
  data: MergeBranchesRequest,
): Promise<MergeBranchesResponse> {
  const res = await fetch("/api/git/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function cleanup(tempDir: string): Promise<CleanupResponse> {
  const res = await fetch("/api/git/cleanup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempDir }),
  });
  return res.json();
}

// ===== Deploy API =====

export async function getDeployEnvironments(): Promise<DeployEnvironmentsResponse> {
  const res = await fetch("/api/deploy/environments");
  return res.json();
}

export async function deployBuild(
  data: DeployBuildRequest,
): Promise<DeployBuildResponse> {
  const res = await fetch(`${DIRECT_API_BASE}/api/deploy/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
