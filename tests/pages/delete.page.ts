import { expect, Page } from '@playwright/test';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';

export async function deleteDashboard(
  page: Page,
  dashboardname: string,
  dashboardDescription: string,
) {
  const dashboardsPage = new DashboardsIndexPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);
  const application = new ApplicationFrame(page);

  // Navigate to the dashboards page
  await dashboardsPage.goto();

  // Find the dashboard row to delete
  const dashboardRow = dashboardsTable.getRow({
    name: dashboardname,
    description: dashboardDescription,
  });

  // Check if the delete button is disabled
  await expect(dashboardsPage.deleteButton).toBeDisabled();

  // Select the dashboard to delete
  await dashboardRow
    .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
    .click();

  // Check if the delete button is enabled
  await expect(dashboardsPage.deleteButton).toBeEnabled();

  // Click the delete button to open the delete confirmation dialog
  await dashboardsPage.deleteButton.click();

  // Check if the delete confirmation dialog is visible
  await deleteDashboardDialog.expectIsVisible();

  // Check if the delete button in the dialog is enabled
  await expect(deleteDashboardDialog.deleteButton).toBeEnabled();

  // Click the delete button in the dialog
  await deleteDashboardDialog.deleteButton.click();

  //Assert that the delete notification to be visible
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted dashboard "My Dashboard".',
  );
}

// Adding delete function to delete first row in the dashboard
export async function deleteFirstRow(page: Page) {
  const dashboardsPage = new DashboardsIndexPage(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page);
  const application = new ApplicationFrame(page);

  // Select the first row to delete
  const checkbox = page.locator(
    "//tr[@data-selection-item='item'][1]//input[@type='checkbox']",
  );
  await checkbox.click();
  // Click the delete button to open the delete confirmation dialog
  await dashboardsPage.deleteButton.click();
  // Click the delete button in the dialog
  await deleteDashboardDialog.deleteButton.click();
  //Assert that the delete notification to be visible
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText(
    'Successfully deleted dashboard "My Dashboard".',
  );
}
