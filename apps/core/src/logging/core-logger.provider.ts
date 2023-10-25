import { LoggerService } from './logger.service';
import { Params, PARAMS_PROVIDER_TOKEN } from 'nestjs-pino';
import { LOGGER_PROVIDER_TOKEN } from './logger.constants';

export const CoreLoggerFactoryProvider = {
  provide: LOGGER_PROVIDER_TOKEN,
  useFactory: (params: Params) => {
    return new LoggerService(params);
  },
  inject: [{ token: PARAMS_PROVIDER_TOKEN, optional: false }],
};
