import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// ✅ Load environment variables
const NODE_ENV = process.env.NODE_ENV || 'dev';
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);

const result = dotenv.config({ path: envPath });
dotenvExpand.expand(result);

if (result.error) {
  console.warn(`⚠️  Failed to load env file at ${envPath}:`, result.error);
} else {
  console.log(
    `✅ Loaded env file for '${NODE_ENV}' environment from: ${envPath}`,
  );
  console.log(
    `🔐 Loaded PORT: ${process.env.PORT}, DATABASE_URL: ${process.env.DATABASE_URL}`,
  );
}

// ✅ Import config and log something from it
import config from './config';

console.log(`📛 Project name from config: ${config.project.name}`);

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(requestIp.mw());
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle(config.project.name)
    .setDescription('NestJS Hackathon Starter API description')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  logger.log(`🚀 Application listening on port ${process.env.PORT || 3000}`);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
