import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import text from './legacy/text';

@Controller('api/01BZ')
@UseGuards(AuthGuard)
export class BzController {
  @Post('text')
  async text(@Body() body: any) {
    const r = await runLegacyHandler(text as any, { body });
    return r.body;
  }
}
