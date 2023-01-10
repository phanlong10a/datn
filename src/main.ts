import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
// const cors = require('cors');
import * as cors from 'cors';
import { SharedModule } from './share_modules/share.module';
// import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  const configService = app.select(SharedModule).get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get('PORT');
  const redis_port = process.env.REDIS_PORT;
  // app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'output_excel'), {
    prefix: '/output_excel/',
  });
  app.use(
    cors({
      origin: '*',
    }),
  );
  await app.listen(port);
}

bootstrap();
