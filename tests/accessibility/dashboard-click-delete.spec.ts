import { expect, test } from '@playwright/test';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
  PreferencesDialog,
} from '../pages/dashboards-index.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { createDashboard } from '../accessibility/create-utils';
import { ApplicationFrame } from '../pages/application-frame.page';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can click delete button in dashboard page ', async ({
    page,
  }) => {
    const deleteDashboardDialog = new DeleteDashboardDialog(page);
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
    await expect(dashboardsPage.deleteButton).toBeDisabled();
    await dashboardRow
      .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
      .click();
    await expect(dashboardsPage.deleteButton).toBeEnabled();
    await deleteDashboardDialog.expectIsNotVisible();
    await dashboardsPage.deleteButton.click();

    //Accessibility test after click Delete button in Dashboard page
    //Once ES lint rules are updated can use console.log
    // console.log('Accessibility Issues for Delete Dashboard : ');
    await accessibilityTest(page);
  });
});
