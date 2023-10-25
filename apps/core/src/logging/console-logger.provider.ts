import { ConsoleLogger } from '@nestjs/common';
import { LOGGER_PROVIDER_TOKEN } from './logger.constants';

export const ConsoleloggerFactoryProvider = {
  provide: LOGGER_PROVIDER_TOKEN,
  useFactory: () => {
    return new ConsoleLogger();
  },
};
