import { request } from '@umijs/max';
import type {
  CleanupResponse,
  DeployBuildRequest,
  DeployBuildResponse,
  DeployEnvironmentsResponse,
  MergeBranchesRequest,
  MergeBranchesResponse,
  SyncBranchesResponse,
} from '@gitcicd/shared';

const TEN_MINUTES = 10 * 60 * 1000;

export async function syncBranches(repoUrl: string) {
  return request<SyncBranchesResponse>('/api/git/sync', {
    method: 'POST',
    data: { repoUrl },
    timeout: TEN_MINUTES,
  });
}

export async function mergeBranches(data: MergeBranchesRequest) {
  return request<MergeBranchesResponse>('/api/git/merge', {
    method: 'POST',
    data,
    timeout: TEN_MINUTES,
  });
}

export async function cleanup(tempDir: string) {
  return request<CleanupResponse>('/api/git/cleanup', {
    method: 'POST',
    data: { tempDir },
    timeout: TEN_MINUTES,
  });
}

export async function getDeployEnvironments() {
  return request<DeployEnvironmentsResponse>('/api/deploy/environments', {
    method: 'GET',
    timeout: TEN_MINUTES,
  });
}

export async function deployBuild(data: DeployBuildRequest) {
  return request<DeployBuildResponse>('/api/deploy/build', {
    method: 'POST',
    data,
    timeout: TEN_MINUTES,
  });
}
