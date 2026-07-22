import type {
  SyncBranchesResponse,
  MergeBranchesRequest,
  MergeBranchesResponse,
  CleanupResponse,
  DeployEnvironmentsResponse,
  DeployBuildRequest,
  DeployBuildResponse,
} from "@gitcicd/shared";

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
  const res = await fetch("/api/deploy/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
