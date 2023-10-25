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
{"level":30,"time":1698405392217,"pid":21672,"hostname":"<my-machine>","reqId":"61560c16-9ebd-4eac-aeb4-e1aa2fce5864","context":"HttpRequestReceived","method":"GET","url":"/"}
{"level":30,"time":1698405392217,"pid":21672,"hostname":"<my-machine>","reqId":"61560c16-9ebd-4eac-aeb4-e1aa2fce5864","context":"CognitoJwtAuthGuard","msg":"Request authorized to public HealthController.check"}
{"level":30,"time":1698405392258,"pid":21672,"hostname":"<my-machine>","reqId":"61560c16-9ebd-4eac-aeb4-e1aa2fce5864","req":{"id":"61560c16-9ebd-4eac-aeb4-e1aa2fce5864","method":"GET","url":"/health"},"res":{"statusCode":200},"responseTime":41,"context":"HttpRequestCompleted","msg":"request completed"}
```

## HTTP log fields

### `level` field:

| **Level:** | trace | debug | info | warn | error | fatal | silent   |
|------------|-------|-------|------|------|-------|-------|----------|
| **Value:** | 10    | 20    | 30   | 40   | 50    | 60    | Infinity |


### Other fields:

| field        | description                                                                  |
|--------------|------------------------------------------------------------------------------|
| time         | time of the log emission                                                     |
| pid          | process id of the application                                                |
| hostname     | name of the host machine                                                     |
| reqId        | id of the request                                                            |
| req          | request information, including: id, method, and url                          |
| res          | response information, including: err (if any), statusCode, and statusMessage |
| responseTime | time taken to respond                                                        |
| context      | execution context                                                            |
| msg          | log message                                                                  |


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
