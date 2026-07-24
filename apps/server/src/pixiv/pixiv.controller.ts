import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import logo from './legacy/logo';
import refresh from './legacy/refresh';
import recommend from './legacy/recommend';
import referer from './legacy/referer';
import illustration from './legacy/illustration';

@Controller('api/pixiv')
@UseGuards(AuthGuard)
export class PixivController {
  private async run(handler: any, body: any) {
    const r = await runLegacyHandler(handler, { body });
    const status = r.status || 200;
    if (status >= 400) {
      throw new HttpException(r.body ?? { message: 'request failed' }, status);
    }
    return r.body;
  }

  @Post('logo')
  async logo(@Body() body: any) {
    return this.run(logo, body);
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    return this.run(refresh, body);
  }

  @Post('recommend')
  async recommend(@Body() body: any) {
    return this.run(recommend, body);
  }

  @Post('referer')
  async referer(@Body() body: any) {
    return this.run(referer, body);
  }

  @Post('illustration')
  async illustration(@Body() body: any) {
    return this.run(illustration, body);
  }
}
