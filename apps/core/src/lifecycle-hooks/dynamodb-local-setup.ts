import {
  CreateTableCommand,
  CreateTableCommandInput,
  DynamoDBClient,
  ResourceInUseException,
} from '@aws-sdk/client-dynamodb';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Credentials } from 'aws-sdk';
import { launch as ddbLocalLaunch } from 'dynamodb-local';
import { databaseConfig } from '../config/database.config';

const apiResourceTable =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../api-resource-table-properties.js') as CreateTableCommandInput;
const TABLE_CREATION_ATTEMPT_NUMBER = 120;
const TABLE_CREATION_ATTEMPT_DELAY = 1000; // in milliseconds

@Injectable()
export class DynamoDbLocalSetupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DynamoDbLocalSetupService.name);

  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  async onApplicationBootstrap() {
    if (this.dbConfig.launchLocal) {
      this.logger.log('Launching DynamoDB local instance');
      await ddbLocalLaunch(this.dbConfig.port);
      this.logger.log('DynamoDB local instance launched');
    }

    await this.createApiResourceTable();
  }

  private async createApiResourceTable() {
    const ddbClient = new DynamoDBClient({
      endpoint: this.dbConfig.endpoint,
      credentials: new Credentials('fakeMyKeyId', 'fakeSecretAccessKey'),
    });
    let attempt = 0;

    do {
      try {
        this.logger.log(
          `Attempt{${++attempt}}: Creating DynamoDB Table {${
            this.dbConfig.tableName
          }}`,
        );

        await ddbClient.send(
          new CreateTableCommand({
            ...apiResourceTable,
            TableName: this.dbConfig.tableName,
          }),
        );

        this.logger.log(`DynamoDB Table "${this.dbConfig.tableName}" created`);

        return;
      } catch (e) {
        if (e instanceof ResourceInUseException) {
          this.logger.log(
            `DynamoDB Table "${this.dbConfig.tableName}" created previously`,
          );
          return;
        }

        this.logger.warn(e);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, TABLE_CREATION_ATTEMPT_DELAY),
      );
    } while (attempt < TABLE_CREATION_ATTEMPT_NUMBER);

    const failureMessage = `Failed to create DynamoDB Table "${this.dbConfig.tableName}"`;
    this.logger.log(failureMessage);
    throw new Error(failureMessage);
  }
}
