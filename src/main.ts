import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());

  const PORT = process.env.PORT || config.get('server.port');
  await app.listen(PORT);

  logger.log(`Aplication listening on port ${PORT}`);
}
bootstrap();
