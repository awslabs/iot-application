# LoggerModule

`LoggerModule` extends Core with an idiomatic NestJS logger. Key features of the module:
- it provides an idiomatic NestJS logger, having the same methods (it provides the default NestJS logger for greater readability under development environment)
- it logs in JSON format for greater queryability
- it logs HTTP request/response information
- it binds request id to logs for request processing services

Sample log from default NestJS logger (ConsoleLogger)

```
[Nest] 86190  - 10/24/2023, 10:47:54 PM     LOG [CognitoJwtAuthGuard] Request authorized to public HealthController.check
```

Sample log from default NestJS logger (ConsoleLogger)

```
{"level":30,"time":1698401998683,"pid":13196,"hostname":"88665a376606.ant.amazon.com","reqId":"a188575a-dc2a-4449-860d-978a7b06eb81","context":"CognitoJwtAuthGuard","msg":"Request authorized to public HealthController.check"}
```

## Configuration

Import LoggerModule to your module (named `AppModule` below):

```
// app.module.ts

import { LoggerModule } from '<src>/logging/logger.module';

@Module({
  imports: [LoggerModule.forRoot()],
  ...
})
class AppModule {}
```

Set `LOGGER_PROVIDER_TOKEN` as the logger service:

```
// main.ts

import { LOGGER_PROVIDER_TOKEN } from '<src>/logging/logger.constants';
...

const app = await NestFactory.create(AppModule, { bufferLogs: true });
app.useLogger(app.get(LOGGER_PROVIDER_TOKEN));
```

## Example

Option 1: Using the logger for application logging:

```
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

Option 2: Injecting the logger:

```
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER_TOKEN } from '<src>/logging/logger.constants';

@Injectable()
class MyService {
  constructor(@Inject('LOGGER_PROVIDER_TOKEN') logger: LoggerService) {
    this.logger.log('Doing something...');
  }
}
```
