import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthIndicatorResult, TerminusModule } from '@nestjs/terminus';
import { DynamoDbHealthIndicator } from './indicators/dynamodb.health';
import { ConfigModule, registerAs } from '@nestjs/config';

describe('HealthController', () => {
  let controller: HealthController;
  let dynamoDbHealthIndicator: DynamoDbHealthIndicator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(registerAs('database', () => ({}))),
        TerminusModule,
      ],
      controllers: [HealthController],
      providers: [DynamoDbHealthIndicator],
    }).compile();

    dynamoDbHealthIndicator = await module.resolve(DynamoDbHealthIndicator);
    controller = await module.resolve(HealthController);
  });

  describe('check', () => {
    test('application status is returned', async () => {
      const dbResult: HealthIndicatorResult = {
        db: {
          status: 'up',
        },
      };
      jest.spyOn(dynamoDbHealthIndicator, 'check').mockResolvedValue(dbResult);

      const status = await controller.check();
      expect(status).toEqual({
        status: 'ok',
        info: {
          db: {
            status: 'up',
          },
        },
        error: {},
        details: {
          db: {
            status: 'up',
          },
        },
      });
    });
  });
});
