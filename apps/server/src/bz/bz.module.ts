import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BzController } from './bz.controller';

@Module({
  imports: [AuthModule],
  controllers: [BzController],
})
export class BzModule {}
