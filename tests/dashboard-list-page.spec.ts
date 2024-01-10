import { test, expect } from './helpers';
import { DashboardsIndexPage } from './pages/dashboards-index.page';

test.describe('dashboard list page', () => {
  test('dashboard is visible', async ({
    page,
    createDashboard,
    deleteDashboards,
  }) => {
    const dashboard = await createDashboard({
      name: 'test dashboard name',
      description: 'test dashboard description',
      definition: {
        widgets: [],
      },
    });

    const dashboardsListPage = new DashboardsIndexPage(page);

    await dashboardsListPage.goto();

    await expect(page.getByText(dashboard.name)).toBeVisible();
    await expect(page.getByText(dashboard.description)).toBeVisible();

    await deleteDashboards({ ids: [dashboard.id] });
  });
});
