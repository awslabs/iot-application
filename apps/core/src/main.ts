import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { bootstrap } from './bootstrap';

/**
 * Start Core
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
 *
 * @internal
 */
const main = async () => {
  /** NestJS application */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await bootstrap(app);
};

void main();
