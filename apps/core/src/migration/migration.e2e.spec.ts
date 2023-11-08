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
  InternalFailureException,
} from '@aws-sdk/client-iotsitewise';

import { mockClient } from 'aws-sdk-client-mock';
import { MigrationService } from './migration.service';
import { DashboardsService } from '../dashboards/dashboards.service';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { MigrationStatus, Status } from './entities/migration-status.entity';

import { ok } from '../types';
import { DashboardSummary } from 'src/dashboards/entities/dashboard-summary.entity';

const dashboardId = 'dashboardId';
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
      id: dashboardId,
      name: 'testDashboard',
      description: 'testDescription',
    },
  ],
};
const testApplicationDashboard = {
  id: dashboardId,
  name: 'testDashboard',
  description: '',
  creationDate: new Date().toString(),
  lastUpdateDate: new Date().toString(),
  definition: { widgets: [] },
};
const testApplicationDashboards: DashboardSummary[] = [
  testApplicationDashboard,
];
const expectedDefinition = { widgets: [] };
const testDashboard: DescribeDashboardResponse = {
  dashboardId: dashboardId,
  dashboardArn: 'testArn',
  dashboardCreationDate: new Date(),
  dashboardDefinition: JSON.stringify(expectedDefinition),
  dashboardLastUpdateDate: new Date(),
  dashboardName: 'testDashboard',
  dashboardDescription: 'testDescription',
  projectId: 'testProjectId',
};

describe('MigrationModule', () => {
  let bearerToken = '';
  let app: NestFastifyApplication;
  let migrationService: MigrationService;
  let dashboardService: DashboardsService;

  let migrateSpy: jest.SpyInstance;
  let migrationStatusSpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;

  const sitewiseMock = mockClient(IoTSiteWiseClient);

  const getStatus = async (): Promise<MigrationStatus> => {
    const getResponse = await app.inject({
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      method: 'GET',
      url: '/api/migration',
    });

    return JSON.parse(getResponse.payload) as unknown as MigrationStatus;
  };

  const waitForStatus = async (): Promise<MigrationStatus> => {
    let status = await getStatus();

    while (status.status === Status.IN_PROGRESS) {
      // Wait a short amount of time to allow status setting to finish
      await new Promise((r) => setTimeout(r, 100));
      status = await getStatus();
    }

    return status;
  };

  beforeEach(async () => {
    sitewiseMock.reset();
    sitewiseMock.on(ListPortalsCommand).resolves(testPortals);
    sitewiseMock.on(ListProjectsCommand).resolves(testProjects);
    sitewiseMock.on(ListDashboardsCommand).resolves(testDashboards);
    sitewiseMock.on(DescribeDashboardCommand).resolves(testDashboard);

    configureTestProcessEnv(process.env);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DashboardsModule],
      providers: [MigrationService],
    }).compile();

    migrationService = moduleRef.get<MigrationService>(MigrationService);
    dashboardService = moduleRef.get<DashboardsService>(DashboardsService);

    migrateSpy = jest.spyOn(migrationService, 'migrate');
    migrationStatusSpy = jest.spyOn(migrationService, 'getMigrationStatus');
    createSpy = jest
      .spyOn(dashboardService, 'create')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(ok(testApplicationDashboard));
        });
      });

    jest.spyOn(dashboardService, 'list').mockReturnValue(
      new Promise((resolve) => {
        resolve(ok([]));
      }),
    );

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

  afterEach(async () => {
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

      expect(migrateSpy).toHaveBeenCalled();
      expect(response.statusCode).toBe(202);
    });

    test('calls DashboardService create if SiteWise Monitor dashboards exist and sets status to complete', async () => {
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
        sitewiseMonitorId: testDashboard.dashboardId,
      });

      expect(response.statusCode).toBe(202);

      const status = await waitForStatus();
      expect(status).toEqual({ status: Status.COMPLETE });
    });

    test('sets status to complete when no SiteWise Monitor dashboards exist', async () => {
      sitewiseMock.on(ListPortalsCommand).resolves(testPortals);
      sitewiseMock.on(ListProjectsCommand).resolves(testProjects);
      sitewiseMock
        .on(ListDashboardsCommand)
        .resolves({ dashboardSummaries: [] });
      sitewiseMock.on(DescribeDashboardCommand).resolves(testDashboard);

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      expect(migrateSpy).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();

      expect(response.statusCode).toBe(202);

      const status = await waitForStatus();
      expect(status).toEqual({ status: Status.COMPLETE });
    });

    test('dedupe - does not create dashboards that have already been migrated', async () => {
      jest.resetAllMocks();
      migrateSpy = jest.spyOn(migrationService, 'migrate');
      migrationStatusSpy = jest.spyOn(migrationService, 'getMigrationStatus');
      createSpy = jest.spyOn(dashboardService, 'create').mockImplementation();
      jest.spyOn(dashboardService, 'list').mockReturnValue(
        new Promise((resolve) => {
          resolve(ok(testApplicationDashboards));
        }),
      );

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      expect(migrateSpy).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(202);
    });

    test('sets status to ERROR when there is an exception', async () => {
      sitewiseMock.on(ListPortalsCommand).resolves(testPortals);
      sitewiseMock.on(ListProjectsCommand).resolves(testProjects);
      sitewiseMock.on(ListDashboardsCommand).resolves(testDashboards);
      const errorMessage = 'Error calling SiteWise APIs';
      sitewiseMock.on(DescribeDashboardCommand).rejects(
        new InternalFailureException({
          message: errorMessage,
          $metadata: {},
        }),
      );

      await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      const status = await waitForStatus();
      expect(status).toEqual({ message: errorMessage, status: Status.ERROR });
    });

    test('returns parsing errors when there are errors parsing dashboard definition', async () => {
      sitewiseMock.on(ListPortalsCommand).resolves(testPortals);
      sitewiseMock.on(ListProjectsCommand).resolves(testProjects);
      sitewiseMock.on(ListDashboardsCommand).resolves(testDashboards);
      sitewiseMock.on(DescribeDashboardCommand).resolves({
        dashboardId: dashboardId,
        dashboardArn: 'testArn',
        dashboardCreationDate: new Date(),
        dashboardDefinition: 'invalidJson',
        dashboardLastUpdateDate: new Date(),
        dashboardName: 'testDashboard',
        dashboardDescription: 'testDescription',
        projectId: 'testProjectId',
      });

      await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });

      const status = await waitForStatus();

      const expectedMessage =
        'error parsing dashboard definitions for SiteWise Monitor dashboard(s): testDashboard';
      expect(status).toEqual({
        message: expectedMessage,
        status: Status.ERROR,
      });
    });

    test('handles paginated results in SiteWise API', async () => {
      sitewiseMock
        .on(ListPortalsCommand)
        .resolvesOnce({
          portalSummaries: testPortals.portalSummaries,
          nextToken: 'token',
        })
        .resolves(testPortals);
      sitewiseMock
        .on(ListProjectsCommand)
        .resolvesOnce({
          projectSummaries: testProjects.projectSummaries,
          nextToken: 'token',
        })
        .resolves(testProjects);
      sitewiseMock
        .on(ListDashboardsCommand)
        .resolvesOnce({
          dashboardSummaries: testDashboards.dashboardSummaries,
          nextToken: 'token',
        })
        .resolves(testDashboards);
      sitewiseMock.on(DescribeDashboardCommand).resolves(testDashboard);

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        url: '/api/migration',
      });
      expect(response.statusCode).toBe(202);

      const status = await waitForStatus();

      expect(migrateSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        name: testDashboard.dashboardName,
        description: testDashboard.dashboardDescription,
        definition: expectedDefinition,
        sitewiseMonitorId: testDashboard.dashboardId,
      });

      expect(status).toEqual({ status: Status.COMPLETE });
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
