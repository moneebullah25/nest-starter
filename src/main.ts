import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';

async function bootstrap() {
  // CORS is enabled

  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(requestIp.mw());

  // Helmet Middleware against known security vulnerabilities
  app.use(helmet());

  // Swagger API Documentation
  const options = new DocumentBuilder()
    .setTitle('NestJS Hackathon Starter by @moneebullah25')
    .setDescription('NestJS Hackathon Starter API description')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  logger.log(`Application listening on port ${process.env.PORT || 3000}`);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
