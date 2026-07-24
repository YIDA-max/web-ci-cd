import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GitModule } from './git/git.module';
import { DeployModule } from './deploy/deploy.module';
import { PixivModule } from './pixiv/pixiv.module';
import { FictionModule } from './fiction/fiction.module';
import { ComicsModule } from './comics/comics.module';
import { BzModule } from './bz/bz.module';
import { UtilsApiModule } from './utils-api/utils-api.module';
import { MooncellModule } from './mooncell/mooncell.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    GitModule,
    DeployModule,
    PixivModule,
    FictionModule,
    ComicsModule,
    BzModule,
    UtilsApiModule,
    MooncellModule,
  ],
})
export class AppModule {}
