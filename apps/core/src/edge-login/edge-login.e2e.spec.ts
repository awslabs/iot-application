import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { configureTestProcessEnv } from '../testing/aws-configuration';
import { EdgeLoginService } from './edge-login.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EdgeCredentials } from './entities/edge-credentials.entity';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

describe('EdgeLoginModule', () => {
  let app: NestFastifyApplication;
  let edgeLoginService: EdgeLoginService;
  let edgeLoginSpy: jest.SpyInstance;

  let httpService: HttpService;
  let httpServiceSpy: jest.SpyInstance;

  const testData: EdgeCredentials = {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
    sessionExpiryTime: '',
  };

  const edgeCredentialResponse = {
    data: testData,
    headers: {},
    config: { url: 'http://localhost:3000/mockUrl' },
    status: 200,
    statusText: 'OK',
  };

  beforeEach(async () => {
    configureTestProcessEnv(process.env);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [EdgeLoginService],
    }).compile();

    edgeLoginService = moduleRef.get<EdgeLoginService>(EdgeLoginService);
    edgeLoginSpy = jest.spyOn(edgeLoginService, 'login');

    httpService = moduleRef.get<HttpService>(HttpService);
    httpServiceSpy = jest
      .spyOn(httpService.axiosRef, 'post')
      .mockImplementationOnce(() => Promise.resolve(edgeCredentialResponse));

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    const instance = app.getHttpAdapter().getInstance() as unknown as {
      ready(): Promise<void>;
    };

    await instance.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/migration HTTP/1.1', () => {
    test('correctly proxies the edge credential request', async () => {
      const requestBody = {
        edgeEndpoint: '1.2.3.4.5',
        username: 'testUser',
        password: 'testPassword',
        authMechanism: 'linux',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/edge-login',
        payload: requestBody,
      });

      expect(edgeLoginSpy).toHaveBeenCalled();
      expect(httpServiceSpy).toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
    });

    test('returns an error if the axios call fails with valid input', async () => {
      const errorResponse = {
        data: {},
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 500,
        statusText: 'OK',
      };
      httpServiceSpy.mockReset();
      httpServiceSpy = jest
        .spyOn(httpService.axiosRef, 'post')
        .mockRejectedValueOnce(errorResponse);

      const requestBody = {
        edgeEndpoint: '1.2.3.4.5',
        username: 'testUser',
        password: 'testPassword',
        authMechanism: 'linux',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/edge-login',
        payload: requestBody,
      });

      expect(edgeLoginSpy).toHaveBeenCalled();
      expect(httpServiceSpy).toHaveBeenCalled();
      expect(response.statusCode).toBe(500);
    });

    test('returns incorrect username/password if the axios call results in 401', async () => {
      const errorResponse: AxiosError = {
        response: {
          body: {
            message: 'Incorrect username or password',
          },
          status: 401,
        },
        isAxiosError: true,
        toJSON: () => {
          return {};
        },
        name: '',
        message: '',
      };

      httpServiceSpy.mockReset();
      httpServiceSpy = jest
        .spyOn(httpService.axiosRef, 'post')
        .mockRejectedValueOnce(errorResponse);

      const requestBody = {
        edgeEndpoint: '1.2.3.4.5',
        username: 'testUser',
        password: 'testPassword',
        authMechanism: 'linux',
      };

      const { body } = await app.inject({
        method: 'POST',
        url: '/api/edge-login',
        payload: requestBody,
      });

      const expectedResponse = {
        statusCode: 401,
        message: 'Incorrect username or password',
        error: 'Unauthorized',
      };

      expect(edgeLoginSpy).toHaveBeenCalled();
      expect(httpServiceSpy).toHaveBeenCalled();

      expect(body).toBe(JSON.stringify(expectedResponse));
    });
  });
});
