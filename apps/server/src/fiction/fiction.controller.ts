import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { AuthGuard } from '../auth/auth.guard';
import { runLegacyHandler } from '../content-shared/run-legacy';
import { getFileRoot } from '../content-shared/utils/File/fileRoot';
import { FICTIONLIST } from './legacy/utils/info';
import books from './legacy/books';
import search from './legacy/search';
import infoTextItem from './legacy/infoTextItem';
import novelText from './legacy/novelText';
import upData from './legacy/upData';
import myFictionList from './legacy/myFictionList';
import myFictionItemInfo from './legacy/myFictionItemInfo';
import myFictionItemContent from './legacy/myFictionItemContent';

function fictionUploadDir() {
  const root = getFileRoot(__dirname);
  const dir = path.join(root, FICTIONLIST);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

@Controller('api/fiction')
@UseGuards(AuthGuard)
export class FictionController {
  @Get('books/:current')
  async books(@Param('current') current: string, @Query() query: any) {
    const r = await runLegacyHandler(books as any, {
      params: { current },
      query,
    });
    return r.body;
  }

  @Get('search')
  async search(@Query() query: any) {
    const r = await runLegacyHandler(search as any, { query });
    return r.body;
  }

  @Post('content')
  async content(@Body() body: any) {
    const r = await runLegacyHandler(infoTextItem as any, { body });
    return r.body;
  }

  @Post('text')
  async text(@Body() body: any) {
    const r = await runLegacyHandler(novelText as any, { body });
    return r.body;
  }

  @Post('upData')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, fictionUploadDir()),
        filename: (_req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  async upData(@UploadedFile() file: Express.Multer.File) {
    const r = await runLegacyHandler(upData as any, {
      files: file ? { file } : undefined,
    });
    return r.body;
  }

  @Get('myFictionList')
  async myFictionList() {
    const r = await runLegacyHandler(myFictionList as any, {});
    return r.body;
  }

  @Post('myFictionItemInfo')
  async myFictionItemInfo(@Body() body: any) {
    const r = await runLegacyHandler(myFictionItemInfo as any, { body });
    return r.body;
  }

  @Post('myFictionItemContent')
  async myFictionItemContent(@Body() body: any) {
    const r = await runLegacyHandler(myFictionItemContent as any, { body });
    return r.body;
  }
}
