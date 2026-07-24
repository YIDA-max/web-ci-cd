import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import comicsHtml from './legacy/comicsHtml';
import getComicList from './legacy/getComicList';
import search from './legacy/search';
import comicsTable from './legacy/comicsTable';
import getComicsInfo from './legacy/getComicsInfo';
import getComicsChapter from './legacy/getComicsChapter';
import getComicsImg from './legacy/getComicsImg';
import comicsDownload from './legacy/comicsDownload';

@Controller('api/comics')
@UseGuards(AuthGuard)
export class ComicsController {
  private async run(handler: any, input: any) {
    const r = await runLegacyHandler(handler, input);
    const status = r.status || 200;
    if (status >= 400) {
      throw new HttpException(r.body ?? { message: 'request failed' }, status);
    }
    return r.body;
  }

  @Get('comicsHtml')
  async comicsHtml(@Res() res: Response) {
    const r = await runLegacyHandler(comicsHtml as any, {});
    if (r.headers['Content-Type']) {
      res.setHeader('Content-Type', r.headers['Content-Type']);
    }
    return res.status(r.status).send(r.body);
  }

  @Get('getComicList')
  async getComicList() {
    return this.run(getComicList, {});
  }

  @Post('search')
  async search(@Body() body: any) {
    return this.run(search, { body });
  }

  @Get('comicsTable')
  async comicsTable(@Query() query: any) {
    return this.run(comicsTable, { query });
  }

  @Post('getComicsInfo')
  async getComicsInfo(@Body() body: any) {
    return this.run(getComicsInfo, { body });
  }

  @Post('getComicsChapter')
  async getComicsChapter(@Body() body: any) {
    return this.run(getComicsChapter, { body });
  }

  @Post('getComicsImg')
  async getComicsImg(@Body() body: any) {
    return this.run(getComicsImg, { body });
  }

  @Post('comicsDownload')
  async comicsDownload(@Body() body: any) {
    return this.run(comicsDownload, { body });
  }
}
