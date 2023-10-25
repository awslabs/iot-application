import { Inject, Injectable } from '@nestjs/common';
import { Logger, Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService extends Logger {
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    const pinoLogger = new PinoLogger(params);
    super(pinoLogger, params);
  }
}
