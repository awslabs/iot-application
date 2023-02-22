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
import {
  CreateDashboardDto,
  Dashboard,
  DashboardDefinition,
  DashboardWidgetType,
  UpdateDashboardDto,
} from 'core-types';
import { nanoid } from 'nanoid';
import { RESOURCE_TYPES } from './dashboard.constants';
import { AppModule } from '../app.module';
import { getAccessToken } from '../testing/jwt-generator';
import { Credentials } from 'aws-sdk';

const dummyId = 'zckYx-InI8_f'; // 12 character
const dummyName = 'dashboard name';
const dummyDescription = 'initial description';
const dummyDateStr = '2023-02-10T00:09:12.896Z';
const dummyDefinition = plainToClass(DashboardDefinition, {
  widgets: [],
});

const databaseEndpoint = 'http://localhost:8001';
const databaseTableName = 'dashboard-api-e2e-test';
const dbDocClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: databaseEndpoint,
    region: 'us-west-2',
    credentials: new Credentials('fakeMyKeyId', 'fakeSecretAccessKey'),
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
}: Dashboard) {
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

const omitProperty = (key: string, obj: Record<string, unknown>): unknown => {
  // eslint-disable-next-line
  const { [key]: _, ...rest } = obj;

  return rest;
};

describe('DashboardsModule', () => {
  let bearerToken = '';
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // TODO: global config to override the environment for test environment
    process.env.DATABASE_PORT = '8001';
    process.env.DATABASE_ENDPOINT = 'http://localhost:8001';
    process.env.DATABASE_TABLE_NAME = 'dashboard-api-e2e-test';
    process.env.DATABASE_LAUNCH_LOCAL = 'false';
    process.env.AWS_ACCESS_KEY_ID = 'fakeMyKeyId';
    process.env.AWS_SECRET_ACCESS_KEY = 'fakeSecretAccessKey';
    process.env.DATABASE_REGION = 'us-west-2';

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
  }, 120000);

  afterAll(async () => {
    await app.close();
  });

  describe('GET /dashboards HTTP/1.1', () => {
    test('returns empty dashboard list on success', async () => {
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual([]);
    });

    test('returns dashboard list on success', async () => {
      const dashboard1 = await seedTestDashboard('dashboard 1 name');
      const dashboard2 = await seedTestDashboard('dashboard 2 name');
      const dashboardSummary1 = omitProperty('definition', dashboard1);
      const dashboardSummary2 = omitProperty('definition', dashboard2);

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(200);

      const responseList = JSON.parse(response.payload) as unknown as Dashboard;
      expect(responseList).toHaveLength(2);
      expect(responseList).toEqual(
        expect.arrayContaining([dashboardSummary1, dashboardSummary2]),
      );
    });
  });

  describe('POST /dashboards HTTP/1.1', () => {
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
        url: '/dashboards',
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
        url: '/dashboards',
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
        }),
      );
    });

    test.each(['x', 'x'.repeat(10), 'x'.repeat(100)])(
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
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(201);
      },
    );

    test.each(['', 'x'.repeat(101), 1, {}, []])(
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
          url: '/dashboards',
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
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(400);
    });

    test.each(['', 'x', 'x'.repeat(10), 'x'.repeat(1024)])(
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
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(201);
      },
    );

    test.each(['x'.repeat(1025), 1, {}, []])(
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
          url: '/dashboards',
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
        url: '/dashboards',
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
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test.each(['', 'x'.repeat(101), 1, {}, []])(
      'returns 400 when widget title is not valid: (%s)',
      async (widgetTitle) => {
        const payload = {
          name: dummyName,
          description: dummyDescription,
          definition: {
            widgets: [
              {
                title: widgetTitle,
                type: DashboardWidgetType.Line,
              },
            ],
          },
        };
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          payload,
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 400 when widget title is missing', async () => {
      const payload = {
        name: dummyName,
        description: 'new description',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.Line,
            },
          ],
        },
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        payload,
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(400);
    });

    test.each([
      DashboardWidgetType.Line,
      DashboardWidgetType.Scatter,
      DashboardWidgetType.Bar,
      DashboardWidgetType.StatusGrid,
      DashboardWidgetType.StatusTimeline,
      DashboardWidgetType.Kpi,
      DashboardWidgetType.Table,
    ])('returns 200 when widget type is valid: (%s)', async (widgetType) => {
      const payload: UpdateDashboardDto = {
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
        url: '/dashboards',
      });

      const { id } = JSON.parse(response.payload) as unknown as Dashboard;

      expect(response.statusCode).toBe(201);
      await assertDatabaseEntry({ id, ...payload });
    });

    test.each([
      '',
      'no-exist',
      1,
      {},
      [],
      [{}],
      [{ title: 'widget title' }],
      [{ type: DashboardWidgetType.Line }],
      [
        {
          title: 'valid widget',
          type: DashboardWidgetType.Line,
        },
        { title: 'invalid widget' },
        {
          title: 'valid widget',
          type: DashboardWidgetType.Line,
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
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );
  });

  describe('GET /dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns dashboard on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(dashboard);
    });

    test.each(['x', 'x'.repeat(11), 'x'.repeat(13), '{}', '[]'])(
      'returns 400 when dashboard id is not valid: (%s)',
      async (dashboardId: Dashboard['id']) => {
        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'GET',
          url: `/dashboards/${dashboardId}`,
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
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /dashboards/{dashboardId} HTTP/1.1', () => {
    test('updated dashboard entry on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              title: 'widget title',
              type: DashboardWidgetType.Line,
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      const { id } = JSON.parse(response.payload) as unknown as Dashboard;

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id,
        ...payload,
      });
    });

    test('returns updated dashboard on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
        name: 'new name',
        definition: {
          widgets: [
            {
              title: 'widget title',
              type: DashboardWidgetType.Line,
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      });
    });

    test.each(['x', 'x'.repeat(11), 'x'.repeat(13), '{}', '[]'])(
      'returns 400 when dashboard id is not valid: (%s)',
      async (dashboardId: Dashboard['id']) => {
        const payload: UpdateDashboardDto = {
          name: 'new name',
          definition: {
            widgets: [
              {
                title: 'widget title',
                type: DashboardWidgetType.Line,
              },
            ],
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test.each(['', 'x'.repeat(101), 1, {}, []])(
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
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
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

    test.each(['', 'x', 'x'.repeat(10), 'x'.repeat(1024)])(
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
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(200);
      },
    );

    test.each(['x'.repeat(1025), 1, {}, []])(
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
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
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

    test('returns 400 when description is missing', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload = {
        name: dummyName,
        definition: dummyDefinition,
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(400);

      await assertDatabaseEntry({
        id: dashboard.id,
        name: 'name',
        description: dummyDescription,
        definition: dummyDefinition,
      });
    });

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
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
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

    test.each(['', 'x'.repeat(101), 1, {}, []])(
      'returns 400 when widget title is not valid: (%s)',
      async (widgetTitle) => {
        const dashboard = await seedTestDashboard('name');

        const payload = {
          name: 'new name',
          definition: {
            widgets: [
              {
                title: widgetTitle,
                type: DashboardWidgetType.Line,
              },
            ],
          },
          description: 'new description',
        };

        const response = await app.inject({
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
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

    test('returns 400 when widget title is missing', async () => {
      const dashboard = await seedTestDashboard('name');

      const payload = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.Line,
            },
          ],
        },
        description: 'new description',
      };

      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(400);

      await assertDatabaseEntry({
        id: dashboard.id,
        name: 'name',
        description: dummyDescription,
        definition: dummyDefinition,
      });
    });

    test.each([
      DashboardWidgetType.Line,
      DashboardWidgetType.Scatter,
      DashboardWidgetType.Bar,
      DashboardWidgetType.StatusGrid,
      DashboardWidgetType.StatusTimeline,
      DashboardWidgetType.Kpi,
      DashboardWidgetType.Table,
    ])('returns 200 when widget type is valid: (%s)', async (widgetType) => {
      const dashboard = await seedTestDashboard('name');

      const payload: UpdateDashboardDto = {
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
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);

      await assertDatabaseEntry({
        id: dashboard.id,
        ...payload,
      });
    });

    test.each([
      '',
      'no-exist',
      1,
      {},
      [],
      [{}],
      [{ title: 'widget title' }],
      [{ type: DashboardWidgetType.Line }],
      [
        {
          title: 'valid widget',
          type: DashboardWidgetType.Line,
        },
        { title: 'invalid widget' },
        {
          title: 'valid widget',
          type: DashboardWidgetType.Line,
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
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
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
              title: 'widget title',
              type: DashboardWidgetType.Line,
            },
          ],
        },
        description: 'new description',
      };
      const response = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns 204 on success', async () => {
      const dashboard = await seedTestDashboard('name');

      const deleteResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'DELETE',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await app.inject({
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
        url: `/dashboards/${dashboard.id}`,
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
          url: `/dashboards/${dashboardId}`,
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
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
