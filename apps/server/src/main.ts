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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const corsOrigins = configService.get<string>("CORS_ORIGINS")?.trim();
  if (!corsOrigins || corsOrigins === "*") {
    app.enableCors({ origin: true, credentials: true });
  } else {
    app.enableCors({
      origin: corsOrigins.split(",").map((o) => o.trim()).filter(Boolean),
      credentials: true,
    });
  }

  const port = configService.get<number>("PORT", 10001);
  const host = configService.get<string>("HOST", "0.0.0.0");

  await app.listen(port, host);

  const logger = new Logger("Bootstrap");
  logger.log(`API → http://${host}:${port}/api/*`);
}

bootstrap();
