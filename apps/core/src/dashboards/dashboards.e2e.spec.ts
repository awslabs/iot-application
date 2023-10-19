import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  TransactGetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { nanoid } from 'nanoid';

import {
  RESOURCE_TYPES,
  DASHBOARD_NAME_MAX_LENGTH,
  DASHBOARD_DESCRIPTION_MAX_LENGTH,
} from './dashboard.constants';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardDefinition } from './entities/dashboard-definition.entity';
import { DashboardWidgetType } from './entities/dashboard-widget.entity';
import { AppModule } from '../app.module';
import {
  configureTestProcessEnv,
  credentials,
  databaseEndpoint,
  databaseTableName,
  region,
} from '../testing/aws-configuration';
import { getAccessToken } from '../testing/jwt-generator';

const dummyId = 'zckYx-InI8_f'; // 12 character
const dummyName = 'dashboard name';
const dummyDescription = 'initial description';
const dummyDateStr = '2023-02-10T00:09:12.896Z';
const dummyDefinition = plainToClass(DashboardDefinition, {
  widgets: [],
});

const dbDocClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: databaseEndpoint,
    credentials,
    region,
  }),
  {
    marshallOptions: {
      convertClassInstanceToMap: true,
    },
  },
);

// E.g. 2023-02-10T00:09:12.896Z
const isoDateMatcher: unknown = expect.stringMatching(
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/,
);

const seedTestDashboard = async (name: Dashboard['name']) => {
  const id = nanoid(12);
  const definition = instanceToPlain(dummyDefinition);

  await dbDocClient.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: databaseTableName,
            Item: {
              id,
              resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
              definition,
            },
          },
        },
        {
          Put: {
            TableName: databaseTableName,
            Item: {
              id,
              resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
              name,
              description: dummyDescription,
              creationDate: dummyDateStr,
              lastUpdateDate: dummyDateStr,
            },
          },
        },
      ],
    }),
  );

  return {
    id,
    name,
    definition,
    description: dummyDescription,
  };
};

const assertDatabaseEntry = async function ({
  id,
  name,
  description,
  definition,
}: Pick<Dashboard, 'id' | 'name' | 'description' | 'definition'>) {
  const { Responses } = await dbDocClient.send(
    new TransactGetCommand({
      TransactItems: [
        {
          Get: {
            TableName: databaseTableName,
            Key: {
              id,
              resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
            },
          },
        },
        {
          Get: {
            TableName: databaseTableName,
            Key: { id, resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION },
          },
        },
      ],
    }),
  );

  expect(Responses).toEqual([
    {
      Item: {
        id,
        resourceType: RESOURCE_TYPES.DASHBOARD_DATA,
        name,
        description,
        creationDate: isoDateMatcher,
        lastUpdateDate: isoDateMatcher,
      },
    },
    {
      Item: {
        id,
        resourceType: RESOURCE_TYPES.DASHBOARD_DEFINITION,
        definition: definition,
      },
    },
  ]);
};

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

  describe('GET /api/dashboards HTTP/1.1', () => {
    test('returns empty dashboard list on success', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual([]);
    });

    test('returns dashboard list on success', async () => {
      const createDashboardResponse1 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload: {
          name: 'dashboard 1 name',
          description: dummyDescription,
          definition: dummyDefinition,
        },
        url: '/api/dashboards',
      });
      const createDashboardResponse2 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload: {
          name: 'dashboard 2 name',
          description: dummyDescription,
          definition: dummyDefinition,
        },
        url: '/api/dashboards',
      });

      const { definition: definition1, ...dashboardSummary1 } = JSON.parse(
        createDashboardResponse1.payload,
      ) as unknown as Dashboard;
      const { definition: definition2, ...dashboardSummary2 } = JSON.parse(
        createDashboardResponse2.payload,
      ) as unknown as Dashboard;

      expect(dashboardSummary1).not.toMatchObject(definition1);
      expect(dashboardSummary1).not.toMatchObject(definition2);

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(200);

      const responseList = JSON.parse(response.payload) as unknown as Dashboard;
      expect(responseList).toHaveLength(2);
      expect(responseList).toEqual(
        expect.arrayContaining([
          expect.objectContaining(dashboardSummary1),
          expect.objectContaining(dashboardSummary2),
        ]),
      );
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/dashboards HTTP/1.1', () => {
    test('created dashboard entry on success', async () => {
      const payload: CreateDashboardDto = {
        name: dummyName,
        description: dummyDescription,
        definition: dummyDefinition,
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/api/dashboards',
      });

      const { id } = JSON.parse(response.payload) as unknown as Dashboard;
      expect(response.statusCode).toBe(201);

      await assertDatabaseEntry({
        id,
        ...payload,
      });
    });

    test('returns newly created dashboard on success', async () => {
      const payload: CreateDashboardDto = {
        name: dummyName,
        description: dummyDescription,
        definition: dummyDefinition,
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/api/dashboards',
      });

      const dashboard = JSON.parse(response.payload) as unknown as Dashboard;

      expect(response.statusCode).toBe(201);
      expect(dashboard).toEqual(
        expect.objectContaining({
          name: payload.name,
          id: expect.stringMatching(/^[a-zA-Z0-9_-]{12}$/) as string,
          definition: {
            widgets: [],
          },
          lastUpdateDate: isoDateMatcher,
          creationDate: isoDateMatcher,
        }),
      );
    });

    test.each(['x', 'x'.repeat(10), 'x'.repeat(DASHBOARD_NAME_MAX_LENGTH)])(
      'returns 201 when name is valid: (%s)',
      async (dashboardName) => {
        const payload: CreateDashboardDto = {
          name: dashboardName,
          description: dummyDescription,
          definition: dummyDefinition,
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(201);
      },
    );

    test.each(['', 'x'.repeat(DASHBOARD_NAME_MAX_LENGTH + 1), 1, {}, []])(
      'returns 400 when name is not valid: (%s)',
      async (dashboardName) => {
        const payload = {
          name: dashboardName,
          description: dummyDescription,
          definition: dummyDefinition,
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 400 when name is missing', async () => {
      const payload = {
        description: dummyDescription,
        definition: dummyDefinition,
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(400);
    });

    test.each([
      'x',
      'x'.repeat(10),
      'x'.repeat(DASHBOARD_DESCRIPTION_MAX_LENGTH),
    ])(
      'returns 201 when description is valid: (%s)',
      async (dashboardDescription) => {
        const payload: CreateDashboardDto = {
          name: dummyName,
          description: dashboardDescription,
          definition: dummyDefinition,
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(201);
      },
    );

    test.each(['', 'x'.repeat(1025), 1, {}, []])(
      'returns 400 when description is not valid: (%s)',
      async (dashboardDescription) => {
        const payload = {
          name: dummyName,
          description: dashboardDescription,
          definition: dummyDefinition,
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 400 when description is missing', async () => {
      const payload = {
        name: dummyName,
        definition: dummyDefinition,
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(400);
    });

    test.each(['widgets', 1, {}])(
      'returns 400 when widgets is not valid: (%s)',
      async (widgetsValue) => {
        const payload = {
          name: dummyName,
          description: dummyDescription,
          definition: {
            widgets: widgetsValue,
          },
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test.each([
      DashboardWidgetType.XYPlot,
      DashboardWidgetType.LineScatterChart,
      DashboardWidgetType.LineChart,
      DashboardWidgetType.ScatterChart,
      DashboardWidgetType.BarChart,
      DashboardWidgetType.Status,
      DashboardWidgetType.StatusTimeline,
      DashboardWidgetType.Kpi,
      DashboardWidgetType.Table,
      DashboardWidgetType.Text,
    ])('returns 200 when widget type is valid: (%s)', async (widgetType) => {
      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: widgetType,
              id: 'widget-id',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/api/dashboards',
      });

      const { id } = JSON.parse(response.payload) as unknown as Dashboard;

      expect(response.statusCode).toBe(201);
      await assertDatabaseEntry({ id, ...payload } as Dashboard);
    });

    test.each([
      '',
      'no-exist',
      1,
      {},
      [],
      [{}],
      [{ type: DashboardWidgetType.LineChart }],
      [{ type: DashboardWidgetType.LineChart, id: 'invalid-widget' }],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing properties',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing x',
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing y',
          x: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing z',
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing width',
          x: 0,
          y: 0,
          z: 0,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing height',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type x',
          x: '0',
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type y',
          x: 0,
          y: '0',
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type z',
          x: 0,
          y: 0,
          z: '0',
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type width',
          x: 0,
          y: 0,
          z: 0,
          width: '1',
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type height',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: '1',
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type properties',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: 'properties',
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'valid-widget',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
        {
          type: DashboardWidgetType.LineChart,
          id: 'invalid-widget',
        },
      ],
    ])(
      'returns 400 when widget type is not valid: (%s)',
      async (widgetType) => {
        const payload = {
          name: 'new name',
          definition: {
            widgets: [
              {
                title: 'widget title',
                type: widgetType,
              },
            ],
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/api/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/dashboards',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns dashboard on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(
        expect.objectContaining(dashboard),
      );
    });

    test.each(['x', 'x'.repeat(11), 'x'.repeat(13), '{}', '[]'])(
      'returns 400 when dashboard id is not valid: (%s)',
      async (dashboardId: Dashboard['id']) => {
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'GET',
          url: `/api/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 404 when dashboard not found', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/dashboards/{dashboardId} HTTP/1.1', () => {
    test('updated dashboard entry on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.LineChart,
              id: 'valid-widget',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      const { id } = JSON.parse(response.payload) as unknown as Dashboard;

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id,
        ...payload,
      } as Dashboard);
    });

    test('returns updated dashboard on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.LineChart,
              id: 'valid-widget',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      } as Dashboard);
    });

    // FIXME: validator is incorrectly returning 400 on partial update in tests only
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip('only updates name when only called with name', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      } as Dashboard);
    });

    // FIXME: validator is incorrectly returning 400 on partial update in tests only
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip('only updates description when only called with description', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      } as Dashboard);
    });

    // FIXME: validator is incorrectly returning 400 on partial update in tests only
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip('only updates definition when only called with definition', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.LineChart,
              id: 'valid-widget',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      } as Dashboard);
    });

    test.each(['x', 'x'.repeat(11), 'x'.repeat(13), '{}', '[]'])(
      'returns 400 when dashboard id is not valid: (%s)',
      async (dashboardId: Dashboard['id']) => {
        const payload: UpdateDashboardDto = {
          name: 'new name',
          definition: {
            widgets: [
              {
                type: DashboardWidgetType.LineChart,
                id: 'valid-widget',
                x: 0,
                y: 0,
                z: 0,
                width: 1,
                height: 1,
                properties: {},
              },
            ],
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test.each(['', 'x'.repeat(41), 1, {}, []])(
      'returns 400 when dashboard name is not valid: (%s)',
      async (dashboardName) => {
        const dashboard = await seedTestDashboard('name');

        const payload = {
          name: dashboardName,
          description: 'new description',
          definition: {},
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        await assertDatabaseEntry({
          id: dashboard.id,
          name: 'name',
          description: dummyDescription,
          definition: dummyDefinition,
        });
      },
    );

    test.each(['x', 'x'.repeat(10), 'x'.repeat(200)])(
      'returns 200 when description is valid: (%s)',
      async (dashboardDescription) => {
        const dashboard = await seedTestDashboard('name');

        const payload: UpdateDashboardDto = {
          name: dummyName,
          description: dashboardDescription,
          definition: dummyDefinition,
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(200);
      },
    );

    test.each([
      '',
      'x'.repeat(DASHBOARD_DESCRIPTION_MAX_LENGTH + 1),
      1,
      {},
      [],
    ])(
      'returns 400 when description is not valid: (%s)',
      async (dashboardDescription) => {
        const dashboard = await seedTestDashboard('name');

        const payload = {
          name: dummyName,
          description: dashboardDescription,
          definition: dummyDefinition,
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        await assertDatabaseEntry({
          id: dashboard.id,
          name: 'name',
          description: dummyDescription,
          definition: dummyDefinition,
        });
      },
    );

    test.each(['widgets', 1, {}])(
      'returns 400 when widgets is not valid: (%s)',
      async (widgetsValue) => {
        const dashboard = await seedTestDashboard('name');

        const payload = {
          name: 'new name',
          definition: {
            widgets: widgetsValue,
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        await assertDatabaseEntry({
          id: dashboard.id,
          name: 'name',
          description: dummyDescription,
          definition: dummyDefinition,
        });
      },
    );

    test.each([
      DashboardWidgetType.XYPlot,
      DashboardWidgetType.LineScatterChart,
      DashboardWidgetType.LineChart,
      DashboardWidgetType.ScatterChart,
      DashboardWidgetType.BarChart,
      DashboardWidgetType.Status,
      DashboardWidgetType.StatusTimeline,
      DashboardWidgetType.Kpi,
      DashboardWidgetType.Table,
      DashboardWidgetType.Text,
    ])('returns 200 when widget type is valid: (%s)', async (widgetType) => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: widgetType,
              id: 'widget-id',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);

      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      } as Dashboard);
    });

    test.each([
      '',
      'no-exist',
      1,
      {},
      [],
      [{}],
      [{ type: DashboardWidgetType.LineChart }],
      [{ type: DashboardWidgetType.LineChart, id: 'invalid-widget' }],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing properties',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing x',
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing y',
          x: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing z',
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing width',
          x: 0,
          y: 0,
          z: 0,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'missing height',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type x',
          x: '0',
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type y',
          x: 0,
          y: '0',
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type z',
          x: 0,
          y: 0,
          z: '0',
          width: 1,
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type width',
          x: 0,
          y: 0,
          z: 0,
          width: '1',
          height: 1,
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type height',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: '1',
          properties: {},
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'wrong type properties',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: 'properties',
        },
      ],
      [
        {
          type: DashboardWidgetType.LineChart,
          id: 'valid-widget',
          x: 0,
          y: 0,
          z: 0,
          width: 1,
          height: 1,
          properties: {},
        },
        {
          type: DashboardWidgetType.LineChart,
          id: 'invalid-widget',
        },
      ],
    ])(
      'returns 400 when widget type is not valid: (%s)',
      async (widgetType) => {
        const dashboard = await seedTestDashboard('name');

        const payload = {
          name: 'new name',
          definition: {
            widgets: [
              {
                title: 'widget title',
                type: widgetType,
              },
            ],
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PATCH',
          payload: payload,
          url: `/api/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        await assertDatabaseEntry({
          id: dashboard.id,
          name: 'name',
          description: dummyDescription,
          definition: dummyDefinition,
        });
      },
    );

    test('returns 404 when dashboard not found', async () => {
      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.LineChart,
              id: 'valid-widget',
              x: 0,
              y: 0,
              z: 0,
              width: 1,
              height: 1,
              properties: {},
            },
          ],
        },
        description: 'new description',
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PATCH',
        payload: payload,
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/dashboards/bulk HTTP/1.1', () => {
    test('returns 200 on success', async () => {
      const dashboard1 = await seedTestDashboard('dashboard 1');
      const dashboard2 = await seedTestDashboard('dashboard 2');
      const dashboard3 = await seedTestDashboard('dashboard 3');

      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        payload: {
          ids: [dashboard1.id, dashboard2.id, dashboard3.id],
        },
        url: `/api/dashboards/bulk`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      expect(JSON.parse(deleteResponse.body)).toEqual({
        deletedIds: [dashboard1.id, dashboard2.id, dashboard3.id],
      });

      const getResponse1 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard1.id}`,
      });

      const getResponse2 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard2.id}`,
      });

      const getResponse3 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard3.id}`,
      });

      expect(getResponse1.statusCode).toBe(404);
      expect(getResponse2.statusCode).toBe(404);
      expect(getResponse3.statusCode).toBe(404);
    });

    test('returns 200 on success when deleting a single dashboard', async () => {
      const dashboard1 = await seedTestDashboard('dashboard 1');
      const dashboard2 = await seedTestDashboard('dashboard 2');
      const dashboard3 = await seedTestDashboard('dashboard 3');

      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        payload: {
          ids: [dashboard2.id],
        },
        url: `/api/dashboards/bulk`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      expect(JSON.parse(deleteResponse.body)).toEqual({
        deletedIds: [dashboard2.id],
      });

      const getResponse1 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard1.id}`,
      });

      const getResponse2 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard2.id}`,
      });

      const getResponse3 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard3.id}`,
      });

      expect(getResponse1.statusCode).toBe(200);
      expect(getResponse2.statusCode).toBe(404);
      expect(getResponse3.statusCode).toBe(200);
    });

    test('returns 200 when called with empty id list', async () => {
      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        payload: {
          ids: [],
        },
        url: `/api/dashboards/bulk`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      expect(JSON.parse(deleteResponse.body)).toEqual({
        deletedIds: [],
      });
    });

    test('returns 404 when any dashboards are not found', async () => {
      const dashboard1 = await seedTestDashboard('dashboard 1');
      const dashboard2 = await seedTestDashboard('dashboard 2');

      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        payload: {
          ids: [dashboard1.id, dashboard2.id, '123456789012'],
        },
        url: `/api/dashboards/bulk`,
      });

      expect(deleteResponse.statusCode).toBe(404);
      expect(JSON.parse(deleteResponse.body)).toEqual({
        deletedIds: [dashboard1.id, dashboard2.id],
      });

      const getResponse1 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard1.id}`,
      });

      const getResponse2 = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard2.id}`,
      });

      expect(getResponse1.statusCode).toBe(404);
      expect(getResponse2.statusCode).toBe(404);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const deleteResponse = await app.inject({
        method: 'DELETE',
        payload: {
          ids: [dummyId],
        },
        url: `/api/dashboards/bulk`,
      });

      expect(deleteResponse.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns 204 on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/api/dashboards/${dashboard.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });

    test.each(['', 'x'.repeat(11), 'x'.repeat(13)])(
      'returns 400 when dashboard id is not valid',
      async (dashboardId) => {
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'DELETE',
          url: `/api/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 404 when dashboard not found', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });

    test('returns 401 when request is unauthenticated', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
