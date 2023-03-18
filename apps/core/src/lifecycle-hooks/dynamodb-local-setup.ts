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
import { launch as ddbLocalLaunch } from 'dynamodb-local';
import { credentials, region } from '../testing/aws-configuration';
import { databaseConfig } from '../config/database.config';

const TABLE_CREATION_ATTEMPT_NUMBER = 30;
const TABLE_CREATION_ATTEMPT_DELAY = 1000; // in milliseconds
const DYNAMODB_LOCAL_OPT_SHARED_DB = '-sharedDb';

@Injectable()
export class DynamoDbLocalSetupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DynamoDbLocalSetupService.name);

  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  async onApplicationBootstrap() {
    if (!this.dbConfig.launchLocal) {
      return;
    }
    this.logger.log('Launching DynamoDB local instance');
    await ddbLocalLaunch(this.dbConfig.port, null, [
      DYNAMODB_LOCAL_OPT_SHARED_DB,
    ]);
    this.logger.log('DynamoDB local instance launched');
    await this.createApiResourceTable();
  }

  private async createApiResourceTable() {
    // TODO: refactor the api-resource-table-properties.js to avoid lint
    const apiResourceTable =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../api-resource-table-properties.js') as CreateTableCommandInput;
    const ddbClient = new DynamoDBClient({
      endpoint: this.dbConfig.endpoint,
      credentials,
      region,
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
