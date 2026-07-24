import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ComicsController } from './comics.controller';

@Module({
  imports: [AuthModule],
  controllers: [ComicsController],
})
export class ComicsModule {}
