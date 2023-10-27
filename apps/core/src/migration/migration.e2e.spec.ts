import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { configureTestProcessEnv } from '../testing/aws-configuration';
import { getAccessToken } from '../testing/jwt-generator';
import { MigrationStatus, Status } from './entities/migration-status.entity';

describe('DashboardsModule', () => {
  let bearerToken = '';
  let app: NestFastifyApplication;

  beforeAll(async () => {
    configureTestProcessEnv(process.env);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    const instance = app.getHttpAdapter().getInstance() as unknown as {
      ready(): Promise<void>;
    };

    await instance.ready();

    bearerToken = await getAccessToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/migration HTTP/1.1', () => {
    test('starts migration after receiving request', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      expect(response.statusCode).toBe(202);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/migration',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/migration HTTP/1.1', () => {
    test('gets migration status', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: '/api/migration',
      });
      const status = JSON.parse(response.payload) as unknown as MigrationStatus;
      expect(status).toEqual({ status: Status.IN_PROGRESS });
      expect(response.statusCode).toBe(200);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/migration',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
