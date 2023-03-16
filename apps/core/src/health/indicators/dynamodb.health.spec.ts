import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckError } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { databaseConfig } from '../../config/database.config';
import { configureTestProcessEnv } from '../../testing/aws-configuration';
import { DynamoDbHealthIndicator } from './dynamodb.health';
import { mockClient } from 'aws-sdk-client-mock';

describe('HealthController', () => {
  const ddbMock = mockClient(DynamoDBClient);
  let dynamoDbHealthIndicator: DynamoDbHealthIndicator;

  beforeEach(async () => {
    ddbMock.reset();
    configureTestProcessEnv(process.env);

    const module = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(databaseConfig)],
      providers: [DynamoDbHealthIndicator],
    }).compile();

    dynamoDbHealthIndicator = await module.resolve(DynamoDbHealthIndicator);
  });

  describe('check', () => {
    test('returns up status', async () => {
      ddbMock.on(DescribeTableCommand).resolves({});

      const result = dynamoDbHealthIndicator.check('db');
      await expect(result).resolves.toEqual({
        db: {
          status: 'up',
        },
      });
    });

    test('returns down status', async () => {
      ddbMock.on(DescribeTableCommand).rejects();

      const result = dynamoDbHealthIndicator.check('db');
      const error = new HealthCheckError('DynamoDB check failed', {
        db: {
          status: 'down',
        },
      });
      await expect(result).rejects.toThrowError(error);
    });
  });
});
