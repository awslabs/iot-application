import { test, expect, Page } from '@playwright/test';
import { accessibilityTest } from './accessibility';
import {
  DashboardsIndexPage,
  PreferencesDialog,
} from '../pages/dashboards-index.page';

test('Empty Dashboard Page Accessibility Test', async ({ page }) => {
  const dashboardsIndexPage = new DashboardsIndexPage(page);
  // const PreferencesDialog = new PreferencesDialog(page);

  // Now navigate to the dashboard page
  await dashboardsIndexPage.goto();

  // Verify the dashboard is opened
  await expect(page).toHaveURL('/dashboards');

  //Click the Show Dev Panel Button
  await page.click('button[title="Show dev panel"]');

  //Click the Settings icon for Preferences
  await page.getByRole('button', { name: 'Preferences' }).click();

  // Click the bottom left corner icon
  await page.getByRole('button', { name: 'Open React Query Devtools' }).click();

  // Click the first item
  await page
    .getByRole('button', { name: '["dashboards","summaries"]' })
    .click();
  //Accessibility test for Empty Dashboard
  console.log(
    'Accessibility Issues for click Create dashboard empty button : ',
  );
  await accessibilityTest(page);
});
