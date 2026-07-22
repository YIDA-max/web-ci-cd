/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-07-22 12:39:32
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-07-22 16:16:53
 * @FilePath: \gitCICD\apps\server\src\main.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局管道：自动校验 + 类型转换
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 允许 Next.js 前端跨域访问
  app.enableCors({
    origin: [
      "http://localhost:10000",
      "http://127.0.0.1:10000",
      "http://192.168.200.218:10000",
      "http://192.168.200.88:10000",
    ],
    credentials: true,
  });

  const port = configService.get<number>("PORT", 10001);
  const host = configService.get<string>("HOST", "127.0.0.1");

  await app.listen(port, host);

  const logger = new Logger("Bootstrap");
  logger.log(`Git Service API → http://${host}:${port}/api/git/*`);
}

bootstrap();
