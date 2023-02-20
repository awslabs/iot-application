import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

/**
 * Setup Core validation and transformation of incoming data
 *
 * @regards
 *
 * All incoming data is automatically validated and transformed into typed
 * primitives and objects.
 *
 * Under the hood, the process utlizes {@link class-validator} and
 * {@link class-transformer}. The libraries are also used directly in DTO and
 * entity files to define validation and transformation rules using provided
 * decorators provided.
 *
 * Incoming requests with invalid payloads will automatically be rejected by
 * Core with `HTTP/1.1 400 Bad Request` and a context specific message.
 *
 * Additionally, the validation and transformation rules integrate with our
 * auto-generated API documentation.
 *
 * @see {@link https://docs.nestjs.com/techniques/validation}
 * @see {@link https://docs.nestjs.com/techniques/validation#auto-validation}
 * @see {@link https://docs.nestjs.com/techniques/validation#transform-payload-objects}
 * @see {@link https://github.com/typestack/class-validator}
 * @see {@link https://github.com/typestack/class-transformer}
 *
 * @internal
 */
const bootstrapValidation = (app: NestFastifyApplication) => {
  app.useGlobalPipes(
    // enables automatic validation of payloads
    new ValidationPipe({
      // enables automatic transformation of payloads
      transform: true,
    }),
  );
};

/**
 * Setup Core documentation
 *
 * @remarks
 *
 * Core API documentation is accessible by visiting
 * {@link http://localhost:3000/docs} in your browser.
 *
 * The API documentation additionally serves as a REST client for manual testing.
 *
 * @see {@link https://docs.nestjs.com/openapi/introduction}.
 *
 * @internal
 */
const bootstrapDocs = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('IoT Application Core')
    .setDescription('Core API documentation')
    .setVersion('1.0')
    .addTag('dashboards')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
};

interface MaybeHotModule {
  hot?: {
    accept(): void;
    dispose(cb: () => Promise<void>): void;
  };
}
/** Webpack module (value is injected at runtime by Webpack) */
declare const module: MaybeHotModule;

/**
 * Main() for Core
 *
 * @regards
 *
 * IoT Application Core, or just Core, is a NestJS application.
 *
 * Core is configured to use Fastify for the underlying HTTP framework. This
 * detail does not matter most of the time, as NestJS is framework and platform
 * agnostic by default. When possible, avoid directly importing Fastify or
 * interacting with the HTTP layer directly when possible.
 *
 * @see {@link https://docs.nestjs.com/first-steps | Nest First Steps}
 * @see {@link https://docs.nestjs.com/techniques/performance | Fastify in Nest}
 * @see {@link https://docs.nestjs.com/recipes/hot-reload | Hot Reload}
 *
 * @internal
 */
const bootstrap = async () => {
  /** NestJS application */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  await app.register(helmet);

  bootstrapValidation(app);
  bootstrapDocs(app);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // enable Hot-Module Replacement (HMR)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};

void bootstrap();
