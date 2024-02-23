import { nanoid } from 'nanoid';
import {
  CancelablePromise,
  CreateDashboardDto,
  Dashboard,
  type DashboardSummary,
} from '../generated';
import type {
  BulkDeleteDashboards,
  CreateDashboard,
  DeleteDashboard,
  ListDashboards,
  ReadDashboard,
  UpdateDashboard,
} from '../types';

const LOCAL_STORAGE_DASHBOARDS_NAMESPACE = 'iot-application-dashboards';

export const listDashboards: ListDashboards = () => {
  return new CancelablePromise<DashboardSummary[]>((resolve) => {
    const dashboards = getLocalStorageDashboards();

    resolve(dashboards);
  });
};

export const readDashboard: ReadDashboard = (id) => {
  return new CancelablePromise<Dashboard>((resolve, reject) => {
    const dashboard = getLocalStorageDashboard(id);

    if (dashboard == null) {
      reject(new Error(`Dashboard with id ${id} does not exist`));
      return;
    }

    resolve(dashboard);
  });
};

export const createDashboard: CreateDashboard = ({
  name,
  description,
  definition,
}) => {
  return new CancelablePromise<Dashboard>((resolve) => {
    const dashboard = {
      id: nanoid(),
      name,
      description,
      definition,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    };

    const dashboards = getLocalStorageDashboards();
    dashboards.push(dashboard);

    localStorage.setItem(
      LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
      JSON.stringify(dashboards),
    );

    resolve(dashboard);
  });
};

export const updateDashboard: UpdateDashboard = (id, dto) => {
  return new CancelablePromise<Dashboard>((resolve, reject) => {
    const dashboards = getLocalStorageDashboards();

    const index = dashboards.findIndex((dashboard) => dashboard.id === id);
    if (index === -1) {
      reject(new Error(`Dashboard with id ${id} does not exist`));
      return;
    }

    const currentDashboard = dashboards[index];
    if (currentDashboard == null) {
      reject(new Error(`Dashboard with id ${id} does not exist`));
      return;
    }

    const dashboard = {
      ...currentDashboard,
      ...dto,
      lastUpdateDate: new Date().toISOString(),
    };

    dashboards[index] = dashboard;
    localStorage.setItem(
      LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
      JSON.stringify(dashboards),
    );

    resolve(dashboard);
  });
};

export const deleteDashboard: DeleteDashboard = (id) => {
  return new CancelablePromise<void>((resolve, reject) => {
    const dashboards = getLocalStorageDashboards();

    const index = dashboards.findIndex((dashboard) => dashboard.id === id);
    if (index === -1) {
      reject(new Error(`Dashboard with id ${id} does not exist`));
      return;
    }

    dashboards.splice(index, 1);
    localStorage.setItem(
      LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
      JSON.stringify(dashboards),
    );

    resolve();
  });
};

export const bulkDeleteDashboards: BulkDeleteDashboards = ({ ids }) => {
  return new CancelablePromise<void>((resolve) => {
    const dashboards = getLocalStorageDashboards();

    const filteredDashboards = dashboards.filter(({ id }) => !ids.includes(id));

    localStorage.setItem(
      LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
      JSON.stringify(filteredDashboards),
    );

    resolve();
  });
};

const getLocalStorageDashboards = () => {
  const dashboardsSerialized = localStorage.getItem(
    LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
  );

  // TODO: dashboards type assertion
  const dashboards: Dashboard[] = dashboardsSerialized
    ? (JSON.parse(dashboardsSerialized) as Dashboard[])
    : [];

  return dashboards;
};

const getLocalStorageDashboard = (id: string) => {
  const dashboards = getLocalStorageDashboards();

  const dashboard = dashboards.find((dashboard) => dashboard.id === id);
  return dashboard;
};

if (import.meta.vitest) {
  const dashboards: Dashboard[] = [];

  beforeAll(() => {
    // Initiates dashboards with incremental values
    for (let i = 0; i < 10; i++) {
      const dashboard = {
        id: `dashboard-id-${i}`,
        name: `dashboard-name-${i}`,
        description: `dashboard-description-${i}`,
        creationDate: new Date(i).toISOString(),
        lastUpdateDate: new Date(i + 1).toISOString(),
        definition: {
          widgets: [],
        },
      };

      dashboards.push(dashboard);
    }
  });

  beforeEach(() => {
    // Resets dashboards
    localStorage.setItem(
      LOCAL_STORAGE_DASHBOARDS_NAMESPACE,
      JSON.stringify(dashboards),
    );
  });

  it('retrieves dashboards from local storage', async () => {
    const dashboards = await listDashboards();

    expect(dashboards).toEqual(dashboards);
  });

  it('retrieves a dashboard from local storage', async () => {
    const id = 'dashboard-id-0';
    const dashboard = await readDashboard(id);

    expect(dashboard).toEqual(dashboards[0]);
  });

  it('creates a dashboard', async () => {
    const newDashboard = {
      name: 'new-dashboard',
      description: 'new-dashboard-description',
      definition: {
        widgets: [
          {
            id: 'new-widget',
            type: 'text',
            properties: {
              text: 'Hello World',
            },
            width: 1,
            height: 2,
            x: 3,
            y: 4,
            z: 5,
          },
        ],
      },
    } satisfies CreateDashboardDto;

    const dashboard = await createDashboard(newDashboard);

    expect(dashboard).toMatchObject(newDashboard);
  });

  it('updates a dashboard', async () => {
    const id = 'dashboard-id-0';
    const updatedDashboard = {
      name: 'updated-dashboard',
      description: 'updated-dashboard-description',
      definition: {
        widgets: [
          {
            id: 'updated-widget',
            type: 'text',
            properties: {
              text: 'Hello World',
            },
            width: 1,
            height: 2,
            x: 3,
            y: 4,
            z: 5,
          },
        ],
      },
    } satisfies CreateDashboardDto;

    const dashboard = await updateDashboard(id, updatedDashboard);

    expect(dashboard).toMatchObject(updatedDashboard);
  });

  it('deletes a dashboard', async () => {
    const id = 'dashboard-id-1';

    await deleteDashboard(id);

    const dashboards = await listDashboards();

    expect(dashboards).toEqual(expect.arrayContaining(dashboards.slice(2, 3)));
  });

  it('bulk deletes dashboards', async () => {
    const ids = ['dashboard-id-2', 'dashboard-id-3'];

    await bulkDeleteDashboards({ ids });

    const dashboards = await listDashboards();

    expect(dashboards).toEqual(expect.arrayContaining(dashboards.slice(4, 5)));
  });
}
