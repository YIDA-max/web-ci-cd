import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UtilsApiController } from './utils-api.controller';

@Module({
  imports: [AuthModule],
  controllers: [UtilsApiController],
})
export class UtilsApiModule {}
