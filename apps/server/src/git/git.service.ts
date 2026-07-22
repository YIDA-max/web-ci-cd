import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { SyncBranchesDto } from './dto/sync-branches.dto';
import { MergeBranchesDto } from './dto/merge-branches.dto';

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  private readonly tempBaseDir: string;

  constructor(private configService: ConfigService) {
    const configuredDir = this.configService.get<string>('GIT_TEMP_DIR');
    this.tempBaseDir = configuredDir || path.join(os.tmpdir(), 'git-merge-temp');
  }

  /**
   * 同步远程分支：克隆仓库，获取并同步所有远程分支
   */
  async syncBranches(dto: SyncBranchesDto) {
    const { repoUrl } = dto;

    try {
      // 每次同步生成唯一会话目录，避免并发冲突
      const tempDir = path.join(
        this.tempBaseDir,
        `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      );

      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      fs.mkdirSync(tempDir, { recursive: true });

      const git = simpleGit(tempDir);

      // 克隆仓库
      this.logger.log(`开始克隆仓库: ${repoUrl}`);
      await git.clone(repoUrl, tempDir);

      // 获取所有远程分支信息
      await git.fetch(['--all']);
      const remoteBranches = await git.branch(['-r']);

      // 获取所有远程分支名称（过滤掉 HEAD）
      const remoteBranchNames = Object.keys(remoteBranches.branches)
        .filter((branch) => !branch.includes('HEAD'))
        .map((branch) => branch.replace('origin/', ''));

      // 获取当前分支（通常是 master 或 main）
      const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);

      // 获取所有本地分支
      const localBranches = await git.branchLocal();
      const localBranchNames = Object.keys(localBranches.branches);

      // 删除本地所有分支（除了当前分支）
      for (const branch of localBranchNames) {
        if (branch !== currentBranch) {
          try {
            await git.branch(['-D', branch]);
          } catch (deleteError) {
            this.logger.warn(`无法删除分支 ${branch}: ${deleteError.message}`);
          }
        }
      }

      // 同步所有远程分支到本地
      for (const branchName of remoteBranchNames) {
        try {
          if (
            !localBranchNames.includes(branchName) ||
            branchName !== currentBranch
          ) {
            try {
              await git.checkout(['-b', branchName, `origin/${branchName}`]);
            } catch {
              try {
                await git.checkout(branchName);
                await git.pull('origin', branchName);
              } catch (pullError) {
                this.logger.warn(
                  `同步分支 ${branchName} 失败: ${pullError.message}`,
                );
              }
            }
          }
        } catch (syncError) {
          this.logger.warn(`同步分支 ${branchName} 失败: ${syncError.message}`);
        }
      }

      // 切换回主分支
      try {
        await git.checkout(currentBranch);
      } catch {
        if (remoteBranchNames.length > 0) {
          await git.checkout(remoteBranchNames[0]);
        }
      }

      this.logger.log(
        `同步完成，共 ${remoteBranchNames.length} 个分支，会话目录: ${tempDir}`,
      );

      return {
        success: true,
        branches: remoteBranchNames,
        tempDir,
        currentBranch,
      };
    } catch (error) {
      this.logger.error(`同步分支失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 执行合并操作：将源分支合并到 master 之外的所有分支
   */
  async mergeBranches(dto: MergeBranchesDto) {
    const { tempDir, sourceBranch, allBranches } = dto;
    const results: any[] = [];
    const conflicts: any[] = [];

    try {
      const git = simpleGit(tempDir);

      // 获取 master 分支名称（可能是 master 或 main）
      const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
      const masterBranch = allBranches.includes('master')
        ? 'master'
        : allBranches.includes('main')
          ? 'main'
          : currentBranch;

      // 过滤掉 master 分支和源分支本身
      const targetBranches = allBranches.filter(
        (branch) => branch !== masterBranch && branch !== sourceBranch,
      );

      // 确保源分支存在
      try {
        await git.checkout(sourceBranch);
        await git.pull('origin', sourceBranch);
      } catch (error) {
        return {
          success: false,
          error: `无法切换到源分支 ${sourceBranch}: ${error.message}`,
        };
      }

      this.logger.log(
        `开始合并: ${sourceBranch} → ${targetBranches.length} 个目标分支`,
      );

      // 遍历所有目标分支进行合并
      for (const targetBranch of targetBranches) {
        try {
          await git.checkout(targetBranch);
          await git.pull('origin', targetBranch);

          try {
            await git.merge([sourceBranch, '--no-edit']);
            await git.push('origin', targetBranch);

            results.push({
              branch: targetBranch,
              success: true,
              message: '合并成功并已推送',
            });
          } catch (mergeError) {
            // 检查是否是合并冲突
            let mergeStatus;
            try {
              mergeStatus = await git.status();
            } catch {
              await git.merge(['--abort']).catch(async () => {
                await git.reset(['--hard', `origin/${targetBranch}`]);
              });
              results.push({
                branch: targetBranch,
                success: false,
                message: `合并失败: ${mergeError.message}`,
                isConflict: false,
              });
              continue;
            }

            if (
              mergeStatus.conflicted &&
              mergeStatus.conflicted.length > 0
            ) {
              conflicts.push({
                branch: targetBranch,
                conflicts: mergeStatus.conflicted,
              });

              await git.merge(['--abort']).catch(async () => {
                await git.reset(['--hard', `origin/${targetBranch}`]);
              });

              results.push({
                branch: targetBranch,
                success: false,
                message: `合并冲突，已跳过。冲突文件: ${mergeStatus.conflicted.join(', ')}`,
                isConflict: true,
              });
            } else {
              await git.merge(['--abort']).catch(async () => {
                await git.reset(['--hard', `origin/${targetBranch}`]);
              });

              results.push({
                branch: targetBranch,
                success: false,
                message: `合并失败: ${mergeError.message}`,
                isConflict: false,
              });
            }
          }
        } catch (error) {
          results.push({
            branch: targetBranch,
            success: false,
            message: `操作失败: ${error.message}`,
            isConflict: false,
          });
        }
      }

      this.logger.log(
        `合并完成: 成功 ${results.filter((r) => r.success).length}/${targetBranches.length}`,
      );

      return {
        success: true,
        results,
        conflicts,
        summary: {
          total: targetBranches.length,
          success: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success && !r.isConflict).length,
          conflicts: results.filter((r) => r.isConflict).length,
        },
      };
    } catch (error) {
      this.logger.error(`合并过程出错: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 清理临时目录
   */
  async cleanup(tempDir: string) {
    try {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        this.logger.log(`已清理临时目录: ${tempDir}`);
      }
      return { success: true };
    } catch (error) {
      this.logger.error(`清理失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
