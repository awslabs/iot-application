import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test(' Edit Page Accessibility Test', async ({ page }) => {
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
  // Accessibility test for Edit page page
  console.log('Acessibility issues for Edit page : ');
  await accessibilityTest(page);
});
