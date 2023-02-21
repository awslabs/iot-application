import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

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
export const bootstrapDocs = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('IoT Application Core')
    .setDescription('Core API documentation')
    .setVersion('1.0')
    .addTag('dashboards')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
};
