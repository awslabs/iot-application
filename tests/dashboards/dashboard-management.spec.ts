import { expect, test } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import {
  DashboardsIndexPage,
  DeleteDashboardDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';

test('as a user, I can create, update, and delete my dashboard', async ({
  page,
}) => {
  test.slow();

  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const application = new ApplicationFrame(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);

  // Introduce uniqueness to isolate test runs
  const dashboardDescription = `My dashboard description ${randomUUID()}`;

  await createDashboardPage.goto();

  await createDashboardPage.nameField.type('My Dashboard');
  await createDashboardPage.descriptionField.type(dashboardDescription);

  await expect(application.notification).toBeHidden();

  await createDashboardPage.createButton.click();

  await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
  await createDashboardPage.expectIsNotCurrentPage();

  await expect(application.notification).toBeVisible();
  await expect(application.notification).toContainText(
    'Successfully created dashboard "My Dashboard".',
  );

  // TODO: Need to clean up the below, we do not persist anymore
  //check if dashboard setting persists
  await page.getByRole('button', { name: 'Settings' }).nth(1).click();
  await expect(page.getByLabel('Number of Rows')).toHaveValue('1000');
  await expect(page.getByLabel('Number of Columns')).toHaveValue('200');
  await expect(page.getByLabel('cell Size')).toHaveValue('20');

  await page.getByLabel('Number of Rows').fill('100');
  await page.getByLabel('Number of Columns').fill('100');
  await page.getByLabel('cell Size').fill('10');

  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Settings' }).nth(1).click();

  await expect(page.getByLabel('Number of Rows')).toHaveValue('100');
  await expect(page.getByLabel('Number of Columns')).toHaveValue('100');
  await expect(page.getByLabel('cell Size')).toHaveValue('10');

  await page.getByRole('button', { name: 'Close' }).click();

  // check if viewport setting persists
  await page.getByRole('button', { name: 'Preview' }).click();

  await page.getByRole('button', { name: 'Last 5 minutes' }).click();

  await page.getByRole('radio', { name: 'Last 5 minutes' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();

  await page.getByRole('button', { name: 'Save' }).click();

  await expect(application.notification).toBeVisible();
  await expect(application.notification).toContainText(
    'Successfully updated dashboard "My Dashboard".',
  );

  await page.reload();
  await expect(page.getByRole('button', { name: 'Last 5 minutes' })).toHaveText(
    'Last 5 minutes',
  );

  await dashboardsPage.goto();

  await expect(page.getByText('My Dashboard', { exact: true })).toBeVisible();
  await expect(page.getByText(dashboardDescription)).toBeVisible();
  await expect(dashboardsPage.deleteButton).toBeDisabled();
  await page
    .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
    .click();
  await expect(dashboardsPage.deleteButton).toBeEnabled();

  await deleteDashboardDialog.expectIsNotVisible();
  await dashboardsPage.deleteButton.click();
  await deleteDashboardDialog.expectIsVisible();

  await expect(deleteDashboardDialog.deleteButton).toBeEnabled();

  await expect(application.notification).toBeHidden();

  await deleteDashboardDialog.deleteButton.click();

  await deleteDashboardDialog.expectIsNotVisible();
  await expect(page.getByText(dashboardDescription)).toBeHidden();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toContainText(
    'Successfully deleted dashboard "My Dashboard".',
  );
});
