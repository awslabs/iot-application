import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { databaseConfig } from '../../config/database.config';

@Injectable()
export class DynamoDbHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(DynamoDbHealthIndicator.name);

  constructor(
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    super();
  }

  async check(key: string) {
    const { endpoint, tableName } = this.dbConfig;

    try {
      await new DynamoDBClient({
        endpoint,
      }).send(
        new DescribeTableCommand({
          TableName: tableName,
        }),
      );

      return this.getStatus(key, true);
    } catch (e) {
      this.logger.error('DynamoDB check failed:');
      this.logger.error(e);

      throw new HealthCheckError(
        'DynamoDB check failed',
        this.getStatus(key, false),
      );
    }
  }
}
