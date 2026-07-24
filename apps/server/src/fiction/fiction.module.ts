import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FictionController } from './fiction.controller';

@Module({
  imports: [AuthModule],
  controllers: [FictionController],
})
export class FictionModule {}
