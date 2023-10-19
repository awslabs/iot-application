import { expect, test } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test.skip(' Accessibility > As a user, I can delete dashboard ', async ({
  page,
}) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const dashboardsTable = new DashboardsTable(page);
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
  // check if viewport setting persists
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  //Click left side img for Resource Explorer
  await page.click('[data-testid="collapsed-left-panel-icon"]');
  //Click right side img for Configuration
  await page.click('[data-testid="collapsed-right-panel-icon"]');
  await page.getByRole('button', { name: 'Time machine' }).click();
  await page.getByRole('radio', { name: 'Last 5 minutes' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully updated dashboard "My Dashboard".',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Time machine' })).toHaveText(
    'Last 5 minutes',
  );
  await dashboardsPage.goto();
  const dashboardRow = dashboardsTable.getRow({
    name: 'My dashboard',
    description: dashboardDescription,
  });
  await expect(dashboardRow).toBeVisible();
  await expect(dashboardsPage.deleteButton).toBeDisabled();
  await dashboardRow
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
  await expect(dashboardRow).toBeHidden();
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted dashboard "My Dashboard".',
  );

  //Accessibility test after click Delete button in Dashboard page with notification
  //Once ES lint rules are updated can use console.log
  //console.log('Accessibility Issues for Delete Dashboard with notification : ');
  await accessibilityTest(page);
});
