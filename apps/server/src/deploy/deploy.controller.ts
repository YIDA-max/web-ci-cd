import { Controller, Get, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeployBuildDto } from './dto/deploy-build.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/deploy')
@UseGuards(AuthGuard)
export class DeployController {
  private readonly logger = new Logger(DeployController.name);

  constructor(private readonly deployService: DeployService) {}

  /**
   * 获取部署环境列表
   * GET /api/deploy/environments
   * 读取 DEPLOY_ENV_FILE 指向的 JSON 配置
   */
  @Get('environments')
  async getEnvironments() {
    this.logger.log('收到获取环境列表请求');
    try {
      const environments = await this.deployService.getEnvironments();
      return { success: true, environments };
    } catch (error) {
      this.logger.error(`获取环境列表失败: ${error.message}`);
      return { success: false, error: error.message, environments: [] };
    }
  }

  /**
   * 执行发版构建
   * POST /api/deploy/build
   * body: { repoUrl, branch, environmentPort, tempDir? }
   */
  @Post('build')
  async build(@Body() dto: DeployBuildDto) {
    this.logger.log(
      `收到发版请求: 分支=${dto.branch}, 环境=端口${dto.environmentPort}`,
    );
    return this.deployService.build(dto);
  }
}
