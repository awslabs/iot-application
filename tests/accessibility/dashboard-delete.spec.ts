import { expect, test } from '@playwright/test';
import {
  DashboardsIndexPage,
  PreferencesDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from '../accessibility/delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can delete dashboard ', async ({ page }) => {
    const application = new ApplicationFrame(page);
    const dashboardsPage = new DashboardsIndexPage(page);
    const preferencesDialog = new PreferencesDialog(page);

    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    await dashboardsPage.goto();

    //Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    //Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);

    //Accessibility test for Delete Dashboard with notification
    //Once ES lint rules are updated can use console.log
    //console.log('Accessibility Issues for Delete Dashboard with notification : ');
    await accessibilityTest(page);
  });
});
