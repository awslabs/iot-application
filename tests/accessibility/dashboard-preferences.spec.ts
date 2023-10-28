import { test, expect } from '@playwright/test';
import { accessibilityTest } from './accessibility-utils';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can check preferences in dashboard', async ({
    page,
  }) => {
    const dashboardsIndexPage = new DashboardsIndexPage(page);
    // const PreferencesDialog = new PreferencesDialog(page);

    // Now navigate to the dashboard page
    await dashboardsIndexPage.goto();

    // Verify the dashboard is opened
    await expect(page).toHaveURL('/dashboards');

    //Click the Settings icon for Preferences
    await page.getByRole('button', { name: 'Preferences' }).click();
    //Accessibility test to check Preferences in dashboard
    //Once ES lint rules are updated can use console.log
    // console.log(
    // 'Accessibility Issues to check Preferences in Dashboard : ',
    // );
    await accessibilityTest(page);
  });
});
