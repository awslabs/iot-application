import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';

import { DashboardsModule } from './dashboards.module';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardWidgetType } from './entities/dashboard-widget.entity';

const dummyId = 'zckYx-InI8_f'; // 12 character

const seedTestDashboard = async (
  app: NestFastifyApplication,
  name: CreateDashboardDto['name'],
) => {
  const payload: CreateDashboardDto = { name };
  const response = await app.inject({
    method: 'POST',
    payload: payload,
    url: '/dashboards',
  });

  const dashboard = JSON.parse(response.payload) as unknown as Dashboard;

  return dashboard;
};

describe('DashboardsModule', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DashboardsModule],
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /dashboards HTTP/1.1', () => {
    test('returns empty dashboard list on success', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual([]);
    });

    test('returns dashboard list on success', async () => {
      const dashboard1 = await seedTestDashboard(app, 'dashboard 1 name');
      const dashboard2 = await seedTestDashboard(app, 'dashboard 2 name');

      const response = await app.inject({
        method: 'GET',
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual([dashboard1, dashboard2]);
    });
  });

  describe('POST /dashboards HTTP/1.1', () => {
    test('returns newly created dashboard on success', async () => {
      const payload: CreateDashboardDto = { name: 'name' };
      const response = await app.inject({
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
        const payload = { name: dashboardName };
        const response = await app.inject({
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
        const payload = { name: dashboardName };
        const response = await app.inject({
          method: 'POST',
          payload,
          url: '/dashboards',
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 400 when name is missing', async () => {
      const payload = {};
      const response = await app.inject({
        method: 'POST',
        payload,
        url: '/dashboards',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns dashboard on success', async () => {
      const dashboard = await seedTestDashboard(app, 'name');

      const response = await app.inject({
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
          method: 'GET',
          url: `/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 404 when dashboard not found', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns updated dashboard on success', async () => {
      const dashboard = await seedTestDashboard(app, 'name');

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
      };

      const response = await app.inject({
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({
        id: dashboard.id,
        ...payload,
      });
      expect(JSON.parse(response.payload)).not.toEqual(dashboard);
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
        };

        const response = await app.inject({
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
        const dashboard = await seedTestDashboard(app, 'name');

        const payload = {
          name: dashboardName,
          definition: {},
        };

        const response = await app.inject({
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        const getResponse = await app.inject({
          method: 'GET',
          url: `/dashboards/${dashboard.id}`,
        });

        expect(JSON.parse(getResponse.payload)).toEqual(dashboard);
        expect(JSON.parse(getResponse.payload)).not.toEqual(
          expect.objectContaining(payload),
        );
      },
    );

    test.each(['widgets', 1, {}])(
      'returns 400 when widgets is not valid: (%s)',
      async (widgetsValue) => {
        const dashboard = await seedTestDashboard(app, 'name');

        const payload = {
          name: 'new name',
          definition: {
            widgets: widgetsValue,
          },
        };

        const response = await app.inject({
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        const getResponse = await app.inject({
          method: 'GET',
          url: `/dashboards/${dashboard.id}`,
        });

        expect(JSON.parse(getResponse.payload)).toEqual(dashboard);
        expect(JSON.parse(getResponse.payload)).not.toEqual(
          expect.objectContaining(payload),
        );
      },
    );

    test.each(['', 'x'.repeat(101), 1, {}, []])(
      'returns 400 when widget title is not valid: (%s)',
      async (widgetTitle) => {
        const dashboard = await seedTestDashboard(app, 'name');

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
        };

        const response = await app.inject({
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        const getResponse = await app.inject({
          method: 'GET',
          url: `/dashboards/${dashboard.id}`,
        });

        expect(JSON.parse(getResponse.payload)).toEqual(dashboard);
        expect(JSON.parse(getResponse.payload)).not.toEqual(
          expect.objectContaining(payload),
        );
      },
    );

    test('returns 400 when widget title is missing', async () => {
      const dashboard = await seedTestDashboard(app, 'name');

      const payload = {
        name: 'new name',
        definition: {
          widgets: [
            {
              type: DashboardWidgetType.Line,
            },
          ],
        },
      };

      const response = await app.inject({
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(400);

      const getResponse = await app.inject({
        method: 'GET',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(JSON.parse(getResponse.payload)).toEqual(dashboard);
      expect(JSON.parse(getResponse.payload)).not.toEqual(
        expect.objectContaining(payload),
      );
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
      const dashboard = await seedTestDashboard(app, 'name');

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
      };

      const response = await app.inject({
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dashboard.id}`,
      });

      expect(response.statusCode).toBe(200);

      const getResponse = await app.inject({
        method: 'GET',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(JSON.parse(getResponse.payload)).not.toEqual(dashboard);
      expect(JSON.parse(getResponse.payload)).toEqual(
        expect.objectContaining(payload),
      );
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
        const dashboard = await seedTestDashboard(app, 'name');

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
        };

        const response = await app.inject({
          method: 'PUT',
          payload: payload,
          url: `/dashboards/${dashboard.id}`,
        });

        expect(response.statusCode).toBe(400);

        const getResponse = await app.inject({
          method: 'GET',
          url: `/dashboards/${dashboard.id}`,
        });

        expect(JSON.parse(getResponse.payload)).toEqual(dashboard);
        expect(JSON.parse(getResponse.payload)).not.toEqual(
          expect.objectContaining(payload),
        );
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
      };
      const response = await app.inject({
        method: 'PUT',
        payload: payload,
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /dashboards/{dashboardId} HTTP/1.1', () => {
    test('returns 204 on success', async () => {
      const dashboard = await seedTestDashboard(app, 'name');

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await app.inject({
        method: 'GET',
        url: `/dashboards/${dashboard.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });

    test.each(['', 'x'.repeat(11), 'x'.repeat(13)])(
      'returns 400 when dashboard id is not valid',
      async (dashboardId) => {
        const response = await app.inject({
          method: 'DELETE',
          url: `/dashboards/${dashboardId}`,
        });

        expect(response.statusCode).toBe(400);
      },
    );

    test('returns 404 when dashboard not found', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/dashboards/${dummyId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
