import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { DashboardsIndexPage, DashboardsTable, DeleteDashboardDialog } from '../pages/dashboards-index.page';

test.describe.configure({ mode: 'serial'})

test('as a user, I can view a list of my dashboards', async ({ page }) => {
  const indexPage = new DashboardsIndexPage(page);

  await indexPage.goto();
  await indexPage.expectIsCurrentPage();
});

test('as a user, I can navigate to the create dashboard page', async ({
  page,
}) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();

  await createDashboardPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage()

  await createDashboardPage.cancelButton.click()

  await dashboardsPage.expectIsCurrentPage();
  await createDashboardPage.expectIsNotCurrentPage()

  await dashboardsPage.emptyCreateButton.click()

  await createDashboardPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage()
});

test('as a user, I can create a dashboard', async ({ page }) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();

  await createDashboardPage.nameField.type('My Dashboard');
  await createDashboardPage.descriptionField.type('My Dashboard Description');

  await createDashboardPage.createButton.click();

  await dashboardsPage.expectIsCurrentPage();
  await createDashboardPage.expectIsNotCurrentPage();
});

test('as a user, I can delete a dashboard', async ({ page }) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page)

  await dashboardsPage.goto();

  const dashboardRow = dashboardsTable.getRow({ name: 'My dashboard', description: 'My dashboard description'})
  await expect(dashboardRow).toBeVisible();

  await dashboardRow.getByRole('checkbox', { name: 'Select dashboard My dashboard' }).click()

  await dashboardsPage.deleteButton.click()

  await deleteDashboardDialog.consentInput.type('confirm')

  await deleteDashboardDialog.deleteButton.click()

  await expect(dashboardRow).not.toBeVisible()
}); 

test('as a user, I can delete multiple dashboards', async ({ page }) => {
  const createDashboardPage = new CreateDashboardPage(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const dashboardsTable = new DashboardsTable(page);
  const deleteDashboardDialog = new DeleteDashboardDialog(page)

  await dashboardsPage.goto();

  await dashboardsPage.createButton.click();

  await createDashboardPage.typeName('My Dashboard');
  await createDashboardPage.typeDescription('My Dashboard Description');

  await createDashboardPage.clickCreate();

  await dashboardsPage.createButton.click();
  await createDashboardPage.typeName('My other Dashboard');
  await createDashboardPage.typeDescription('My other Dashboard Description');
  await createDashboardPage.clickCreate();

  await expect(dashboardsTable.getRow({ name: 'My dashboard', description: 'My dashboard description' })).toBeVisible()
  await expect(dashboardsTable.getRow({ name: 'My other dashboard', description: 'My other dashboard description' })).toBeVisible()

  await page.getByRole('checkbox', { name: 'Select dashboard My dashboard' }).click()
  await page.getByRole('checkbox', { name: 'Select dashboard My other dashboard' }).click()

  await dashboardsPage.deleteButton.click()

  await deleteDashboardDialog.consentInput.type('confirm')

  await deleteDashboardDialog.deleteButton.click()

  await expect(dashboardsTable.getRow({ name: 'My dashboard', description: 'My dashboard description' })).not.toBeVisible()
  await expect(dashboardsTable.getRow({ name: 'My other dashboard', description: 'My other dashboard description' })).not.toBeVisible()
});
