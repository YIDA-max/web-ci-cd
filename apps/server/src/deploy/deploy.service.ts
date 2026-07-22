import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
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
  private readonly confPath: string;
  private readonly workspaceBase: string;
  private readonly buildOutputDir: string;
  private readonly installCmd: string;
  private readonly buildCmd: string;

  constructor(private configService: ConfigService) {
    this.confPath = this.configService.get<string>(
      'DEPLOY_CONF_PATH',
      '/etc/nginx/conf.d/webDev.conf',
    );
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
      // 相对路径基于 monorepo 根目录解析
      this.workspaceBase = path.resolve(__dirname, '../../../..', configuredWorkspace);
    }
  }

  /**
   * 解析 Nginx 配置，返回环境列表
   */
  async getEnvironments(): Promise<DeployEnvironment[]> {
    const content = fs.readFileSync(this.confPath, 'utf-8');

    // 解析 map $server_port $backend_url { ... }
    const backendMap = this.parseNginxMap(content, 'backend_url');
    // 解析 map $server_port $static_root { ... }
    const staticMap = this.parseNginxMap(content, 'static_root');
    // 解析 map $server_port $strip_api_prefix { ... }
    const stripMap = this.parseNginxMap(content, 'strip_api_prefix');

    const environments: DeployEnvironment[] = [];

    // 合并三个 map，以端口为 key
    const allPorts = new Set([
      ...Object.keys(backendMap),
      ...Object.keys(staticMap),
    ]);

    for (const port of allPorts) {
      if (port === 'default') continue;

      const backendEntry = backendMap[port] || { value: '', comment: '' };
      const staticEntry = staticMap[port] || { value: '', comment: '' };
      const stripValue = stripMap[port]?.value;

      environments.push({
        port,
        description: backendEntry.comment || staticEntry.comment || `端口 ${port}`,
        backendUrl: backendEntry.value || '',
        staticRoot: staticEntry.value || '',
        stripApiPrefix: stripValue === '1',
      });
    }

    // 按端口号排序
    environments.sort((a, b) => parseInt(a.port) - parseInt(b.port));

    this.logger.log(`解析到 ${environments.length} 个部署环境`);
    return environments;
  }

  /**
   * 解析 Nginx map 块
   * 返回 { port: { value, comment } }
   */
  private parseNginxMap(
    content: string,
    varName: string,
  ): Record<string, { value: string; comment: string }> {
    const result: Record<string, { value: string; comment: string }> = {};

    // 匹配 map $server_port $varName { ... }
    const mapRegex = new RegExp(
      `map\\s+\\$server_port\\s+\\$${varName}\\s*\\{([\\s\\S]*?)\\}`,
    );
    const match = content.match(mapRegex);
    if (!match) return result;

    const blockContent = match[1];

    // 匹配每行：~^18888$    "http://...";              # 88线上服务
    // 或：      ~^18888$    "D:/App/.../html";
    const lineRegex = /~\^(\d+)\$\s+"([^"]+)"\s*;\s*(?:#\s*(.*))?/g;
    let lineMatch;

    while ((lineMatch = lineRegex.exec(blockContent)) !== null) {
      const port = lineMatch[1];
      const value = lineMatch[2];
      const comment = (lineMatch[3] || '').trim();
      result[port] = { value, comment };
    }

    // 也解析 default 行
    const defaultRegex = /default\s+"([^"]+)"\s*;/;
    const defaultMatch = blockContent.match(defaultRegex);
    if (defaultMatch) {
      result['default'] = { value: defaultMatch[1], comment: '' };
    }

    return result;
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
