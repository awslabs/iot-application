import { expect, test } from '@playwright/test';
import {
  DashboardsIndexPage,
  DashboardsTable,
  PreferencesDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from './delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can click build button in dashboard ', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);
    const preferencesDialog = new PreferencesDialog(page);
    const application = new ApplicationFrame(page);

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

    const dashboardRow = dashboardsTable.getRow({
      name: 'My dashboard',
      description: dashboardDescription,
    });
    await expect(dashboardRow).toBeVisible();
    await expect(dashboardsPage.buildButton).toBeDisabled();
    await dashboardRow
      .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
      .click();
    await expect(dashboardsPage.buildButton).toBeEnabled();
    await dashboardsPage.buildButton.click();

    //Accessibility test for Build Button in Dashboard page
    //Once ES lint rules are updated can use console.log
    // console.log('Accessibility Issues for Build in Dashboard : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
