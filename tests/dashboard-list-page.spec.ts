import { test, expect } from './helpers';

test.describe('dashboard list page', () => {
  test('empty page', async ({ page, dashboardListPage }) => {
    await expect(
      page.getByText('No dashboards', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('No dashboards to display', { exact: true }),
    ).toBeVisible();
    await expect(dashboardListPage.emptyCreateButton).toBeVisible();
  });

  test('dashboards are visible', async ({
    page,
    dashboardListPageWithDashboards: { dashboard1, dashboard2 },
  }) => {
    await expect(page.getByText(dashboard1.name)).toBeVisible();
    await expect(page.getByText(dashboard1.description)).toBeVisible();
    await expect(page.getByText(dashboard2.name)).toBeVisible();
    await expect(page.getByText(dashboard2.description)).toBeVisible();
  });

  test('a single dashboard can be deleted', async ({
    page,
    applicationFrame,
    dashboardListPageWithDashboards: {
      dashboardListPage,
      dashboard1,
      dashboard2,
    },
  }) => {
    await page
      .getByRole('checkbox', { name: `Select dashboard ${dashboard2.name}` })
      .click();
    await dashboardListPage.deleteButton.click();
    await dashboardListPage.deleteDashboardDialog.deleteButton.click();

    await expect(applicationFrame.notification).toBeVisible();
    await applicationFrame.dismissNotificationButton.click();

    await expect(page.getByText(dashboard1.name)).toBeVisible();
    await expect(page.getByText(dashboard1.description)).toBeVisible();
    await expect(page.getByText(dashboard2.name)).toBeHidden();
    await expect(page.getByText(dashboard2.description)).toBeHidden();
  });

  test('multiple dashboards can be deleted', async ({
    page,
    applicationFrame,
    dashboardListPageWithDashboards: {
      dashboardListPage,
      dashboard1,
      dashboard2,
    },
  }) => {
    await page
      .getByRole('checkbox', { name: `Select dashboard ${dashboard1.name}` })
      .click();
    await page
      .getByRole('checkbox', { name: `Select dashboard ${dashboard2.name}` })
      .click();
    await dashboardListPage.deleteButton.click();
    await dashboardListPage.deleteDashboardDialog.deleteButton.click();

    await expect(applicationFrame.notification).toBeVisible();
    await applicationFrame.dismissNotificationButton.click();

    await expect(dashboardListPage.emptyCreateButton).toBeVisible();
    await expect(page.getByText(dashboard1.name)).toBeHidden();
    await expect(page.getByText(dashboard1.description)).toBeHidden();
    await expect(page.getByText(dashboard2.name)).toBeHidden();
    await expect(page.getByText(dashboard2.description)).toBeHidden();
  });
});
