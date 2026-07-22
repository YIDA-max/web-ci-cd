// ===== Git 分支批量合并工具 - 共享类型定义 =====

/** 同步分支响应 */
export interface SyncBranchesResponse {
  success: boolean;
  branches?: string[];
  tempDir?: string;
  currentBranch?: string;
  error?: string;
}

/** 单个分支合并结果 */
export interface GitResult {
  branch: string;
  success: boolean;
  message: string;
  isConflict?: boolean;
}

/** 合并冲突记录 */
export interface GitConflict {
  branch: string;
  conflicts: string[];
}

/** 合并汇总统计 */
export interface GitSummary {
  total: number;
  success: number;
  failed: number;
  conflicts: number;
}

/** 批量合并响应 */
export interface MergeBranchesResponse {
  success: boolean;
  results?: GitResult[];
  conflicts?: GitConflict[];
  summary?: GitSummary;
  error?: string;
}

/** 清理响应 */
export interface CleanupResponse {
  success: boolean;
  error?: string;
}

/** API 请求体类型 */
export interface SyncBranchesRequest {
  repoUrl: string;
}

export interface MergeBranchesRequest {
  tempDir: string;
  sourceBranch: string;
  allBranches: string[];
}
