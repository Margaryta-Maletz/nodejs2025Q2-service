import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import { join } from 'path';
import { readFile } from 'fs/promises';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const path = join(__dirname, '..', 'doc', 'api.yaml');
  const content = await readFile(path, { encoding: 'utf8' });
  const document = parse(content);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/doc`);
}
bootstrap();
