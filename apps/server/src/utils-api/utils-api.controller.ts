import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import epubFile from './legacy/epubFile';

@Controller('api/utils')
@UseGuards(AuthGuard)
export class UtilsApiController {
  @Post('epubFile')
  async epubFile(@Body() body: any) {
    const r = await runLegacyHandler(epubFile as any, { body });
    return r.body;
  }
}
