import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitModule } from './git/git.module';
import { DeployModule } from './deploy/deploy.module';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Git 操作模块（合并工具）
    GitModule,
    // 发版部署模块
    DeployModule,
  ],
})
export class AppModule {}
