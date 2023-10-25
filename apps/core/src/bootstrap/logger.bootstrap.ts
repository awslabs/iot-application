import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { LOGGER_PROVIDER_TOKEN } from '../logging/logger.constants';

export const bootstrapLogger = (app: NestFastifyApplication) => {
  app.useLogger(app.get(LOGGER_PROVIDER_TOKEN));
};
