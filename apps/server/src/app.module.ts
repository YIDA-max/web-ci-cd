import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitModule } from './git/git.module';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Git 操作模块
    GitModule,
  ],
})
export class AppModule {}
