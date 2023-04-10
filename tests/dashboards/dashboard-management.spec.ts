import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';

test.describe.configure({ mode: 'serial' });

test('as a user, I can view a list of my dashboards', async ({
  page,
  browserName,
}) => {
  const indexPage = new DashboardsIndexPage(page);

  await indexPage.goto();
  await indexPage.expectIsCurrentPage();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-empty.png`,
  });
});

test('as a user, I can navigate to the create dashboard page', async ({
  page,
}) => {
  test.slow();

  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();

  await createDashboardPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();

  await createDashboardPage.cancelButton.click();

  await dashboardsPage.expectIsCurrentPage();
  await createDashboardPage.expectIsNotCurrentPage();

  await dashboardsPage.emptyCreateButton.click();

  await createDashboardPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
});

test('as a user, I can create a dashboard', async ({ page, browserName }) => {
  test.slow();

  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const application = new ApplicationFrame(page);

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();

  await createDashboardPage.nameField.type('My Dashboard');
  await createDashboardPage.descriptionField.type('My Dashboard Description');

  await expect(application.notification).toBeHidden();

  await createDashboardPage.createButton.click();

  await dashboardsPage.expectIsCurrentPage();
  await createDashboardPage.expectIsNotCurrentPage();

  await expect(application.notification).toBeVisible();
  await expect(application.notification).toContainText(
    'Successfully created dashboard "My Dashboard".',
  );

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-created.png`,
  });
});

test('as a user, I can delete a dashboard', async ({ page, browserName }) => {
  test.slow();

  const dashboardsPage = new DashboardsIndexPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);
  const application = new ApplicationFrame(page);

  await dashboardsPage.goto();

  const dashboardRow = dashboardsTable.getRow({
    name: 'My dashboard',
    description: 'My dashboard description',
  });
  await expect(dashboardRow).toBeVisible();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-not-selected.png`,
  });

  await expect(dashboardsPage.deleteButton).toBeDisabled();
  await dashboardRow
    .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
    .click();
  await expect(dashboardsPage.deleteButton).toBeEnabled();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-single-selected.png`,
  });

  await deleteDashboardDialog.expectIsNotVisible();
  await dashboardsPage.deleteButton.click();
  await deleteDashboardDialog.expectIsVisible();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/delete-dashboard-single-modal.png`,
  });

  await expect(deleteDashboardDialog.deleteButton).toBeDisabled();
  await deleteDashboardDialog.consentInput.type('confirm');
  await expect(deleteDashboardDialog.deleteButton).toBeEnabled();
  await expect(application.notification).toBeHidden();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/delete-dashboard-modal-single-confirm.png`,
  });

  await deleteDashboardDialog.deleteButton.click();

  await deleteDashboardDialog.expectIsNotVisible();
  await expect(dashboardRow).toBeHidden();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted dashboard "My Dashboard".',
  );

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-deleted-single.png`,
  });
});

test('as a user, I can delete multiple dashboards', async ({
  page,
  browserName,
}) => {
  test.slow();

  const createDashboardPage = new CreateDashboardPage(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);
  const application = new ApplicationFrame(page);

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();
  await createDashboardPage.typeName('My Dashboard');
  await createDashboardPage.typeDescription('My Dashboard Description');
  await createDashboardPage.clickCreate();

  await dashboardsPage.createButton.click();
  // notification should disappear on navigation
  await expect(application.notification).toBeHidden();
  await createDashboardPage.typeName('My other Dashboard');
  await createDashboardPage.typeDescription('My other Dashboard Description');
  await createDashboardPage.clickCreate();
  await application.dismissNotificationButton.click();

  await expect(
    dashboardsTable.getRow({
      name: 'My dashboard',
      description: 'My dashboard description',
    }),
  ).toBeVisible();
  await expect(
    dashboardsTable.getRow({
      name: 'My other dashboard',
      description: 'My other dashboard description',
    }),
  ).toBeVisible();

  await expect(dashboardsPage.deleteButton).toBeDisabled();
  await page
    .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
    .click();
  await expect(dashboardsPage.deleteButton).toBeEnabled();
  await page
    .getByRole('checkbox', { name: 'Select dashboard My other dashboard' })
    .click();
  await expect(dashboardsPage.deleteButton).toBeEnabled();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-multiple-selected.png`,
  });

  await dashboardsPage.deleteButton.click();
  await deleteDashboardDialog.expectIsVisible();

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/delete-dashboard-multiple-modal.png`,
  });

  await deleteDashboardDialog.consentInput.type('confirm');

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/delete-dashboard-modal-multiple-confirm.png`,
  });

  await expect(application.notification).toBeHidden();
  await deleteDashboardDialog.deleteButton.click();
  await expect(
    dashboardsTable.getRow({
      name: 'My dashboard',
      description: 'My dashboard description',
    }),
  ).toBeHidden();
  await expect(
    dashboardsTable.getRow({
      name: 'My other dashboard',
      description: 'My other dashboard description',
    }),
  ).toBeHidden();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted 2 dashboards.',
  );

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/dashboards-deleted-multiple.png`,
  });
});
