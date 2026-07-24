import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { GitService } from './git.service';
import { SyncBranchesDto } from './dto/sync-branches.dto';
import { MergeBranchesDto } from './dto/merge-branches.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/git')
@UseGuards(AuthGuard)
export class GitController {
  private readonly logger = new Logger(GitController.name);

  constructor(private readonly gitService: GitService) {}

  /**
   * 同步远程分支
   * POST /api/git/sync
   * body: { repoUrl: string }
   */
  @Post('sync')
  async syncBranches(@Body() dto: SyncBranchesDto) {
    this.logger.log(`收到同步请求: ${dto.repoUrl}`);
    return this.gitService.syncBranches(dto);
  }

  /**
   * 批量合并分支
   * POST /api/git/merge
   * body: { tempDir: string, sourceBranch: string, allBranches: string[] }
   */
  @Post('merge')
  async mergeBranches(@Body() dto: MergeBranchesDto) {
    this.logger.log(
      `收到合并请求: ${dto.sourceBranch} → ${dto.allBranches.length} 个分支`,
    );
    return this.gitService.mergeBranches(dto);
  }

  /**
   * 清理临时目录
   * POST /api/git/cleanup
   * body: { tempDir: string }
   */
  @Post('cleanup')
  async cleanup(@Body() dto: { tempDir: string }) {
    this.logger.log(`收到清理请求: ${dto.tempDir}`);
    return this.gitService.cleanup(dto.tempDir);
  }
}
