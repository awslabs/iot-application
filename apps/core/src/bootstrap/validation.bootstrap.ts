import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

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
export const bootstrapValidation = (app: NestFastifyApplication) => {
  app.useGlobalPipes(
    // enables automatic validation of payloads
    new ValidationPipe({
      // enables automatic transformation of payloads
      transform: true,
    }),
  );
};
