import { test, expect } from '@playwright/test';
import { accessibilityTest } from './accessibility';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';

test.skip('Accessibility > As a user, I can check settings in dashboard', async ({
  page,
}) => {
  const dashboardsIndexPage = new DashboardsIndexPage(page);
  // const PreferencesDialog = new PreferencesDialog(page);

  // Now navigate to the dashboard page
  await dashboardsIndexPage.goto();

  // Verify the dashboard is opened
  await expect(page).toHaveURL('/dashboards');

  await page.getByRole('button', { name: 'Settings' }).click();
  //Accessibility test for Dashboard with Settings
  //Once ES lint rules are updated can use console.log
  // console.log(
  // );
  await accessibilityTest(page);
});
