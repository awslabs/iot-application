import { test, expect, violationFingerprints } from './helpers';

test('empty page', async ({ page, emptyDashboardListPage }) => {
  const noDashboardsLocator = page.getByText('No dashboards', {
    exact: true,
  });
  await page.mouse.wheel(0, 300);
  await expect(noDashboardsLocator).toBeVisible();
  await expect(
    page.getByText('No dashboards to display', { exact: true }),
  ).toBeVisible();
  await expect(emptyDashboardListPage.emptyCreateButton).toBeVisible();
});

test('dashboards are visible', async ({
  page,
  dashboardListPageWithDashboards: { dashboard1, dashboard2 },
}) => {
  await page.mouse.wheel(0, 300);
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
  await page.mouse.wheel(0, 300);
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
  await page.mouse.wheel(0, 300);
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

  const emptyButton = dashboardListPage.emptyCreateButton;

  await page.mouse.wheel(0, 200);
  await expect(emptyButton).toBeVisible();
  await expect(page.getByText(dashboard1.name)).toBeHidden();
  await expect(page.getByText(dashboard1.description)).toBeHidden();
  await expect(page.getByText(dashboard2.name)).toBeHidden();
  await expect(page.getByText(dashboard2.description)).toBeHidden();
});

test('accessibility', async ({
  makeAxeBuilder,
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dashboardListPageWithDashboards: { dashboard1, dashboard2 },
}) => {
  await page.mouse.wheel(0, 300);
  await expect(page.getByText(dashboard1.name)).toBeVisible();
  await expect(page.getByText(dashboard1.description)).toBeVisible();
  await expect(page.getByText(dashboard2.name)).toBeVisible();
  await expect(page.getByText(dashboard2.description)).toBeVisible();

  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // TODO: fix target-size violation
  expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot(
    'dashboard-list-page-accessibility-scan-results',
  );
});
