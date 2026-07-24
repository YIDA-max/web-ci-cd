import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import homePage from './legacy/homePage';

@Controller('api/monncell')
@UseGuards(AuthGuard)
export class MooncellController {
  @Get('homePage')
  async homePage(@Res() res: Response) {
    const r = await runLegacyHandler(homePage as any, {});
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(r.status).send(r.body);
  }
}
