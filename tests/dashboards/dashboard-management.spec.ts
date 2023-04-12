import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';

test('as a user, I can create, update, and delete my dashboard', async ({
  page,
}) => {
  test.slow();

  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const application = new ApplicationFrame(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);

  await createDashboardPage.goto();

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

  const dashboardRow = dashboardsTable.getRow({
    name: 'My dashboard',
    description: 'My dashboard description',
  });
  await expect(dashboardRow).toBeVisible();

  await page.getByRole('link', { name: 'My dashboard' }).click();

  await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully updated dashboard "My Dashboard".',
  );

  await dashboardsPage.goto();

  await expect(dashboardRow).toBeVisible();
  await expect(dashboardsPage.deleteButton).toBeDisabled();
  await dashboardRow
    .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
    .click();
  await expect(dashboardsPage.deleteButton).toBeEnabled();

  await deleteDashboardDialog.expectIsNotVisible();
  await dashboardsPage.deleteButton.click();
  await deleteDashboardDialog.expectIsVisible();

  await expect(deleteDashboardDialog.deleteButton).toBeDisabled();
  await deleteDashboardDialog.consentInput.type('confirm');
  await expect(deleteDashboardDialog.deleteButton).toBeEnabled();

  await expect(application.notification).toBeHidden();

  await deleteDashboardDialog.deleteButton.click();

  await deleteDashboardDialog.expectIsNotVisible();
  await expect(dashboardRow).toBeHidden();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted dashboard "My Dashboard".',
  );
});
