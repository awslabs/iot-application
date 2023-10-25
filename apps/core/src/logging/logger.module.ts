import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ProdLoggerFactoryProvider } from './prod-logger.provider';
import { isDevEnv } from '../types/environment';
import { DevloggerFactoryProvider } from './dev-logger.provider';
import { pinoHttpConfigs } from './pino-http.configs';

@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    if (isDevEnv()) {
      return this.developmentLoggerForRoot();
    }

    return this.productionLoggerForRoot();
  }

  private static developmentLoggerForRoot(): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      providers: [DevloggerFactoryProvider],
    };
  }

  private static productionLoggerForRoot(): DynamicModule {
    return {
      global: true,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: pinoHttpConfigs,
        }),
      ],
      module: LoggerModule,
      providers: [ProdLoggerFactoryProvider],
    };
  }
}
