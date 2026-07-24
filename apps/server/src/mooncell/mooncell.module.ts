import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MooncellController } from './mooncell.controller';

@Module({
  imports: [AuthModule],
  controllers: [MooncellController],
})
export class MooncellModule {}
