import { ConsoleLogger } from '@nestjs/common';
import { LOGGER_PROVIDER_TOKEN } from './logger.constants';

export const DevloggerFactoryProvider = {
  provide: LOGGER_PROVIDER_TOKEN,
  useFactory: () => {
    return new ConsoleLogger();
  },
};
