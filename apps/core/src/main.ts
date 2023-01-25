import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

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
    .setTitle("IoT Application Core")
    .setDescription("Core API documentation")
    .setVersion("1.0")
    .addTag("dashboards")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);
};

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
 * @see {@link https://docs.nestjs.com/first-steps}
 * @see {@link https://docs.nestjs.com/techniques/performance}
 *
 * @internal
 */
const bootstrap = async () => {
  /** NestJS application */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  bootstrapDocs(app);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
};

bootstrap();
