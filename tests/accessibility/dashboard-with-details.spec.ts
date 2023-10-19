import { expect, test } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test(' Dashboard With Details Accessibility Test', async ({ page }) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const application = new ApplicationFrame(page);

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
  //Accessibility test for Dashboard page for details in dashboard table
  console.log(
    'Accessibility Issues for Dashboard page for details in dashboard table: ',
  );
  await accessibilityTest(page);
});
