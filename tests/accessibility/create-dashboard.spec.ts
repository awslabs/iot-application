import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { accessibilityTest } from './accessibility';

test(' Create Dashboard Page Accessibility Test', async ({ page }) => {
  const createDashboardPage = new CreateDashboardPage(page);

  //Now navigate to the dashboard page and give dashboard url
  await createDashboardPage.goto();

  // Verify the dashboard is opened
  await expect(page).toHaveURL('/dashboards/create');

  //Accessibility test for Create Dashboard Page
  console.log('Accessibility Issues for Create dashboard page : ');
  await accessibilityTest(page);
});
