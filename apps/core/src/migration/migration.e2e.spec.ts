import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { configureTestProcessEnv } from '../testing/aws-configuration';
import { getAccessToken } from '../testing/jwt-generator';
import {
  IoTSiteWiseClient,
  ListPortalsCommand,
  ListProjectsCommand,
  ListDashboardsCommand,
  ListDashboardsResponse,
  DescribeDashboardCommand,
  DescribeDashboardResponse,
} from '@aws-sdk/client-iotsitewise';

import { mockClient } from 'aws-sdk-client-mock';
import { MigrationService } from './migration.service';
import { DashboardsService } from '../dashboards/dashboards.service';
import { DashboardsModule } from '../dashboards/dashboards.module';

const sitewiseMock = mockClient(IoTSiteWiseClient);

const testPortals = {
  portalSummaries: [
    {
      id: 'portalId',
      name: 'testPortal',
      startUrl: 'test',
      status: { state: 'complete' },
    },
  ],
};
const testProjects = {
  projectSummaries: [
    {
      id: 'projectId',
      name: 'testProject',
    },
  ],
};
const testDashboards: ListDashboardsResponse = {
  dashboardSummaries: [
    {
      id: 'dashboardId',
      name: 'testDashboard',
      description: 'testDescription',
    },
  ],
};
const expectedDefinition = { widgets: [] };
const testDashboard: DescribeDashboardResponse = {
  dashboardId: 'testId',
  dashboardArn: 'testArn',
  dashboardCreationDate: new Date(),
  dashboardDefinition: JSON.stringify(expectedDefinition),
  dashboardLastUpdateDate: new Date(),
  dashboardName: 'testDashboard',
  dashboardDescription: 'testDescription',
  projectId: 'testProjectId',
};

// TODO: Add pagination and error handling tests
describe('MigrationModule', () => {
  let bearerToken = '';
  let app: NestFastifyApplication;
  let migrationService: MigrationService;
  let dashboardService: DashboardsService;

  let migrateSpy: jest.SpyInstance;
  let migrationStatusSpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;

  beforeAll(async () => {
    configureTestProcessEnv(process.env);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DashboardsModule],
      providers: [MigrationService],
    }).compile();

    migrationService = moduleRef.get<MigrationService>(MigrationService);
    dashboardService = moduleRef.get<DashboardsService>(DashboardsService);

    migrateSpy = jest.spyOn(migrationService, 'migrate');
    migrationStatusSpy = jest.spyOn(migrationService, 'getMigrationStatus');
    createSpy = jest.spyOn(dashboardService, 'create');

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

  beforeEach(() => {
    sitewiseMock.reset();
    sitewiseMock.on(ListPortalsCommand).resolves({ portalSummaries: [] });
    sitewiseMock.on(ListProjectsCommand).resolves({ projectSummaries: [] });
    sitewiseMock.on(ListDashboardsCommand).resolves({ dashboardSummaries: [] });
  });

  describe('POST /api/migration HTTP/1.1', () => {
    test('calls migration', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      expect(migrateSpy).toHaveBeenCalled();
      expect(response.statusCode).toBe(202);
    });

    test('call DashboardService create if SiteWise Monitor dashboards exist', async () => {
      sitewiseMock.reset();
      sitewiseMock.on(ListPortalsCommand).resolves(testPortals);
      sitewiseMock.on(ListProjectsCommand).resolves(testProjects);
      sitewiseMock.on(ListDashboardsCommand).resolves(testDashboards);
      sitewiseMock.on(DescribeDashboardCommand).resolves(testDashboard);

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      expect(migrateSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        name: testDashboard.dashboardName,
        description: testDashboard.dashboardDescription,
        definition: expectedDefinition,
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
      expect(migrationStatusSpy).toHaveBeenCalled();
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
