import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PixivController } from './pixiv.controller';

@Module({
  imports: [AuthModule],
  controllers: [PixivController],
})
export class PixivModule {}
