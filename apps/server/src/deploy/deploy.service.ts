import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import simpleGit from 'simple-git';
import { DeployBuildDto } from './dto/deploy-build.dto';

const execAsync = promisify(exec);

export interface DeployEnvironment {
  port: string;
  description: string;
  backendUrl: string;
  staticRoot: string;
  stripApiPrefix: boolean;
}

export interface LogEntry {
  step: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);
  /** 环境列表 JSON 文件的绝对路径（与 Nginx conf 解耦） */
  private readonly envFilePath: string;
  private readonly workspaceBase: string;
  private readonly buildOutputDir: string;
  private readonly installCmd: string;
  private readonly buildCmd: string;

  constructor(private configService: ConfigService) {
    this.envFilePath = this.resolveEnvFilePath();
    this.buildOutputDir = this.configService.get<string>(
      'DEPLOY_BUILD_OUTPUT_DIR',
      'html',
    );
    this.installCmd = this.configService.get<string>(
      'DEPLOY_INSTALL_CMD',
      'npm install',
    );
    this.buildCmd = this.configService.get<string>(
      'DEPLOY_BUILD_CMD',
      'npm run build',
    );

    const configuredWorkspace = this.configService.get<string>(
      'DEPLOY_WORKSPACE',
      '.deploy-workspace',
    );
    if (path.isAbsolute(configuredWorkspace)) {
      this.workspaceBase = configuredWorkspace;
    } else {
      this.workspaceBase = path.resolve(
        process.cwd(),
        configuredWorkspace,
      );
    }

    this.logger.log(`发版环境配置文件: ${this.envFilePath}`);
  }

  /**
   * 解析环境配置路径：
   * 1) DEPLOY_ENV_FILE（绝对路径，或相对进程 cwd）
   * 2) 打包内置：cwd/config/deploy-envs.json、dist/config/deploy-envs.json
   */
  private resolveEnvFilePath(): string {
    const configured =
      this.configService.get<string>('DEPLOY_ENV_FILE')?.trim() ||
      this.configService.get<string>('DEPLOY_CONF_PATH')?.trim();

    if (configured) {
      return path.isAbsolute(configured)
        ? configured
        : path.resolve(process.cwd(), configured);
    }

    const candidates = [
      path.resolve(process.cwd(), 'config/deploy-envs.json'),
      path.resolve(__dirname, '../config/deploy-envs.json'),
      path.resolve(__dirname, '../../config/deploy-envs.json'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    // 默认指向包内约定路径（打包后也会有）
    return candidates[0];
  }

  /**
   * 读取独立环境配置文件（JSON），不再解析 Nginx conf
   */
  async getEnvironments(): Promise<DeployEnvironment[]> {
    if (!fs.existsSync(this.envFilePath)) {
      throw new Error(
        `环境配置文件不存在: ${this.envFilePath}\n请将 deploy-envs.json 放进包内 config/，或设置 DEPLOY_ENV_FILE`,
      );
    }

    const raw = fs.readFileSync(this.envFilePath, 'utf-8');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(
        `环境配置 JSON 解析失败: ${this.envFilePath}\n${(e as Error).message}`,
      );
    }

    const list = Array.isArray(parsed)
      ? parsed
      : (parsed as { environments?: unknown })?.environments;

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error(
        `环境配置为空: ${this.envFilePath}\n请在 environments 数组中添加入口`,
      );
    }

    const environments: DeployEnvironment[] = list.map((item: any, index) => {
      const port = String(item.port ?? '').trim();
      const staticRoot = String(item.staticRoot ?? item.static_root ?? '').trim();
      if (!port || !staticRoot) {
        throw new Error(
          `环境配置第 ${index + 1} 项缺少 port 或 staticRoot`,
        );
      }
      if (!path.isAbsolute(staticRoot)) {
        throw new Error(
          `环境 ${port} 的 staticRoot 必须是绝对路径，当前: ${staticRoot}`,
        );
      }
      return {
        port,
        description: String(item.description || `端口 ${port}`),
        backendUrl: String(item.backendUrl || item.backend_url || ''),
        staticRoot: path.normalize(staticRoot),
        stripApiPrefix: Boolean(
          item.stripApiPrefix ?? item.strip_api_prefix ?? true,
        ),
      };
    });

    environments.sort((a, b) => parseInt(a.port, 10) - parseInt(b.port, 10));
    this.logger.log(`读取到 ${environments.length} 个部署环境`);
    return environments;
  }

  /**
   * 执行完整的发版流程
   */
  async build(dto: DeployBuildDto) {
    const logs: LogEntry[] = [];
    const addLog = (step: string, message: string) => {
      const entry = { step, message, timestamp: new Date().toISOString() };
      logs.push(entry);
      this.logger.log(`[${step}] ${message}`);
    };

    let tempDir: string;
    let needClone = true;

    try {
      // 1. 确定工作目录
      if (dto.tempDir && fs.existsSync(dto.tempDir)) {
        tempDir = dto.tempDir;
        addLog('准备', '使用已存在的同步会话目录');
        needClone = false;
      } else {
        tempDir = path.join(
          this.workspaceBase,
          `deploy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        );
        fs.mkdirSync(tempDir, { recursive: true });
        addLog('准备', `创建构建工作目录: ${tempDir}`);
      }

      const git = simpleGit(tempDir);

      // 2. Clone 仓库（如果需要）
      if (needClone) {
        addLog('克隆', `开始克隆仓库: ${dto.repoUrl}`);
        await git.clone(dto.repoUrl, tempDir);
        await git.fetch(['--all']);
        addLog('克隆', '仓库克隆完成');
      }

      // 3. Checkout 目标分支
      addLog('切换分支', `切换到分支: ${dto.branch}`);
      try {
        await git.checkout(dto.branch);
        await git.pull('origin', dto.branch);
      } catch {
        // 如果本地没有该分支，尝试从远程创建
        await git.checkout(['-b', dto.branch, `origin/${dto.branch}`]);
      }
      addLog('切换分支', `已切换到分支: ${dto.branch}`);

      // 4. 安装依赖
      addLog('安装依赖', `执行: ${this.installCmd}`);
      const { stdout: installStdout, stderr: installStderr } = await execAsync(
        this.installCmd,
        { cwd: tempDir, maxBuffer: 10 * 1024 * 1024 },
      );
      if (installStdout) addLog('安装依赖', '依赖安装完成');
      if (installStderr && installStderr.trim()) {
        addLog('安装依赖', `安装输出: ${installStderr.trim().slice(0, 500)}`);
      }

      // 5. 构建项目
      addLog('构建', `执行: ${this.buildCmd}`);
      const { stdout: buildStdout, stderr: buildStderr } = await execAsync(
        this.buildCmd,
        { cwd: tempDir, maxBuffer: 10 * 1024 * 1024 },
      );
      if (buildStdout) addLog('构建', `构建输出: ${buildStdout.trim().slice(-500)}`);
      if (buildStderr && buildStderr.trim()) {
        addLog('构建', `构建日志: ${buildStderr.trim().slice(-300)}`);
      }
      addLog('构建', '项目构建完成');

      // 6. 检查构建产物
      const buildOutputPath = path.join(tempDir, this.buildOutputDir);
      if (!fs.existsSync(buildOutputPath)) {
        throw new Error(
          `构建产物目录不存在: ${this.buildOutputDir}/\n请确认项目的构建输出目录配置正确（当前配置: DEPLOY_BUILD_OUTPUT_DIR=${this.buildOutputDir}）`,
        );
      }
      addLog('构建产物', `构建产物目录: ${buildOutputPath}`);

      // 7. 获取目标环境信息
      const environments = await this.getEnvironments();
      const env = environments.find((e) => e.port === dto.environmentPort);
      if (!env) {
        throw new Error(`找不到端口 ${dto.environmentPort} 对应的部署环境`);
      }
      addLog('部署目标', `${env.description} (端口 ${env.port})`);
      addLog('部署目标', `静态文件目录: ${env.staticRoot}`);

      // 8. 清空目标目录
      if (fs.existsSync(env.staticRoot)) {
        addLog('清理', `清空目标目录: ${env.staticRoot}`);
        const files = fs.readdirSync(env.staticRoot);
        for (const file of files) {
          const filePath = path.join(env.staticRoot, file);
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      } else {
        addLog('清理', `目标目录不存在，创建: ${env.staticRoot}`);
        fs.mkdirSync(env.staticRoot, { recursive: true });
      }

      // 9. 复制构建产物到目标目录
      addLog('部署', `复制构建产物到: ${env.staticRoot}`);
      this.copyDir(buildOutputPath, env.staticRoot);
      addLog('部署', '文件复制完成');

      // 10. 验证部署结果
      const deployedFiles = fs.readdirSync(env.staticRoot);
      addLog('验证', `目标目录包含 ${deployedFiles.length} 个文件/目录`);
      if (deployedFiles.includes('index.html')) {
        addLog('验证', '✅ index.html 已部署');
      }

      // 11. 清理临时目录（仅当是本次创建的）
      if (needClone) {
        addLog('清理', '清理临时构建目录');
        fs.rmSync(tempDir, { recursive: true, force: true });
      }

      addLog('完成', `✅ 发版成功！分支 ${dto.branch} 已部署到 ${env.description}`);

      return {
        success: true,
        logs,
        environment: env,
      };
    } catch (error) {
      addLog('错误', `❌ ${error.message}`);

      // 清理临时目录
      if (tempDir && needClone && fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch {
          // ignore cleanup error
        }
      }

      return {
        success: false,
        logs,
        error: error.message,
      };
    }
  }

  /**
   * 递归复制目录
   */
  private copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
