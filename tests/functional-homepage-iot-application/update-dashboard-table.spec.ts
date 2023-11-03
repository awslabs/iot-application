import { test, expect } from '@playwright/test';
import {
  DashboardsIndexPage,
  DashboardsTable,
  DeleteDashboardDialog,
  PreferencesDialog,
} from '../pages/dashboards-index.page';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { deleteDashboard } from '../pages/delete.page';
import { createDashboard } from '../pages/create.page';

test.describe('Homepage For Iot Application', () => {
  test.slow();
  // Positive Scenario: Verify dashboard table
  test('verify dashboard table', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);
    const application = new ApplicationFrame(page);
    const preferencesDialog = new PreferencesDialog(page);

    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Navigate to dashboard page
    await dashboardsPage.goto();

    // Verify the dashboard is opened
    await dashboardsPage.expectIsCurrentPage();

    // Click Create Dashboard button if Dashboard table is empty
    await page.getByRole('button', { name: 'Create dashboard' }).click();

    // Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // To check View Button, navigate to the dashboard page
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    const dashboardRow = dashboardsTable.getRow({
      name: 'My dashboard',
      description: dashboardDescription,
    });
    await expect(dashboardRow).toBeVisible();
    await expect(dashboardsPage.viewButton).toBeDisabled();
    await dashboardRow
      .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
      .click();
    await expect(dashboardsPage.viewButton).toBeEnabled();
    // Click the View button
    await dashboardsPage.viewButton.click();

    // To check the Build Button, navigate to the dashboard
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(dashboardRow).toBeVisible();
    await expect(dashboardsPage.viewButton).toBeDisabled();
    await dashboardRow
      .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
      .click();
    await expect(dashboardsPage.buildButton).toBeEnabled();
    // Click the Build button
    await dashboardsPage.buildButton.click();

    // Navigate to dashboard page to click on ID
    await dashboardsPage.goto();
    // Loacte the ID and click in the dashboard
    const id = page.locator('td.awsui_body-cell-first-row_c6tup_xpjfg_145 a');
    await id.waitFor({ state: 'visible' });
    await id.click();

    // Checking the Delete button
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  // Positive Scenario: Create Dashboard Button - Verify dashboard table
  test('create dashboard button - verify dashboard table', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);
    const preferencesDialog = new PreferencesDialog(page);

    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Navigate to dashboard page
    await dashboardsPage.goto();
    // Verify the dashboard is opened
    await dashboardsPage.expectIsCurrentPage();

    // Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();
    // Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );
    // Navigate to dashboard page
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Checking the Delete button
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  // Negative scenario - Creating a dashboard without name
  test('create a dashboard without a name', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const createDashboardPage = new CreateDashboardPage(page);
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Navigate to the dashboard creation page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();

    // Clear the name field to create a dashboard without a name
    await createDashboardPage.clearName();

    // Provide a description
    await createDashboardPage.descriptionField.type(dashboardDescription);

    // Click the Create button
    await createDashboardPage.createButton.click();

    // Ensure we are still on the same page
    await createDashboardPage.expectIsCurrentPage();

    // Expect the "Dashboard name is required" error message
    const errorMessage = 'Dashboard name is required.';
    await expect(createDashboardPage.nameRequiredError).toHaveText(
      errorMessage,
    );
  });

  // Negative scenario - Creating a dashboard name with excessively long name
  test('creating a dashboard with an excessively long name', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const createDashboardPage = new CreateDashboardPage(page);
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Navigate to the dashboard creation page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();

    // Clear the name field to create a dashboard without a name
    await createDashboardPage.typeExceedMaxLengthName();

    // Provide a description
    await createDashboardPage.descriptionField.type(dashboardDescription);

    // Click the Create button
    await createDashboardPage.createButton.click();

    // Ensure we are still on the same page
    await createDashboardPage.expectIsCurrentPage();

    // Expect the "Dashboard name must be 100 characters or less" error message
    const errorMessage = 'Dashboard name must be 100 characters or less.';
    await expect(createDashboardPage.nameMaxLengthError).toHaveText(
      errorMessage,
    );
  });

  // Negative scenario - Creating a dashboard without description
  test('creating a dashboard without a description', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const createDashboardPage = new CreateDashboardPage(page);

    // Navigate to the dashboard creation page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    //Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();

    // Enter a dashboard name
    await createDashboardPage.typeName('My Dashboard');

    // Do not provide a description (leave it empty)
    await createDashboardPage.clearDescription();

    // Click the Create button
    await createDashboardPage.clickCreate();

    // Ensure we are still on the same page
    await createDashboardPage.expectIsCurrentPage();

    // Expect the "Dashboard description is required." error message
    const errorMessage = 'Dashboard description is required.';
    await expect(createDashboardPage.descriptionRequiredError).toHaveText(
      errorMessage,
    );
  });

  // Negative scenario - Creating a dashboard description with excessively long name
  test('creating a dashboard with an excessively long description', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const createDashboardPage = new CreateDashboardPage(page);

    // Navigate to the dashboard creation page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();

    // Enter a dashboard name
    await createDashboardPage.nameField.type('My Dashboard');

    // Enter a very long description
    await createDashboardPage.typeExceedMaxLengthDescription();

    // Click the Create button
    await createDashboardPage.clickCreate();

    // Expect the "Dashboard description must be 200 characters or less" error message
    const errorMessage =
      'Dashboard description must be 200 characters or less.';
    await expect(createDashboardPage.descriptionMaxLengthError).toHaveText(
      errorMessage,
    );
  });

  // Negative scenario - Creating a dashboard without name, description
  test('creating a dashboard without name, description', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const createDashboardPage = new CreateDashboardPage(page);

    // Navigate to the dashboard creation page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Click Create button if Dashboard table has details
    await page.locator('button[data-testid="table-create-dashboard"]').click();

    // Clear the name field to create a dashboard without a name
    await createDashboardPage.clearName();

    // Do not provide a description (leave it empty)
    await createDashboardPage.clearDescription();

    // Click the Create button
    await createDashboardPage.clickCreate();

    // Expect the "Dashboard name is required" error message
    const nameErrorMessage = 'Dashboard name is required.';
    await expect(createDashboardPage.nameRequiredError).toHaveText(
      nameErrorMessage,
    );

    // Expect the "Dashboard description is required." error message
    const descriptionerrorMessage = 'Dashboard description is required.';
    await expect(createDashboardPage.descriptionRequiredError).toHaveText(
      descriptionerrorMessage,
    );
  });

  // Negative scenario - Check delete button availability without dashboard selection
  test('check delete button availability without dashboard selection', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Check if the "Delete" button is initially disabled
    await dashboardsPage.expectDeleteButtonDisabled();

    // Assert that delete button is disabled
    await expect(dashboardsPage.deleteButton).toBeDisabled();
  });

  //Negative scenario - Cancel deletion
  test('cancel deletion', async ({ page }) => {
    const application = new ApplicationFrame(page);
    const dashboardsPage = new DashboardsIndexPage(page);
    const preferencesDialog = new PreferencesDialog(page);
    const dashboardsTable = new DashboardsTable(page);
    const deleteDashboardDialog = new DeleteDashboardDialog(page);

    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    await dashboardsPage.goto();

    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Find the dashboard row to delete
    const dashboardRow = dashboardsTable.getRow({
      name: 'My dashboard',
      description: dashboardDescription,
    });

    await expect(dashboardsPage.deleteButton).toBeDisabled();
    await dashboardRow
      .getByRole('checkbox', { name: 'Select dashboard My dashboard' })
      .click();

    await dashboardsPage.deleteButton.click();

    // Click Cancel
    await deleteDashboardDialog.cancelButton.click();

    // Check the delete confirmation dialog is no longer visible
    await deleteDashboardDialog.expectIsNotVisible();

    // Assert that the delete button is still enabled
    await expect(dashboardsPage.deleteButton).toBeEnabled();

    // Now delete the dashboard after asserting
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  // Negative scenario - Check view button availability without dashboard selection
  test('check view button availability without dashboard selection', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Check if the "View" button is initially disabled
    await dashboardsPage.expectViewButtonDisabled();

    // Assert that view button is disabled
    await expect(dashboardsPage.viewButton).toBeDisabled();
  });

  // Negative scenario - Check build button availability without dashboard selection
  test('check build button availability without dashboard selection', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Check if the "Build" button is initially disabled
    await dashboardsPage.expectBuildButtonDisabled();

    // Assert that build button is disabled
    await expect(dashboardsPage.buildButton).toBeDisabled();
  });

  // Negative scenario - Click multiple id's to check the delete button availability
  test('click multiple ids to check the delete button availability', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);
    const deleteDashboardDialog = new DeleteDashboardDialog(page);
    const preferencesDialog = new PreferencesDialog(page);

    //Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Navigate to dashboard page
    await dashboardsPage.goto();

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );
    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    //For selecting multiple rows checking the Delete Button, navigate to the dashboard page
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Click the main checkbox to select multiple dashboards
    const mainCheckbox = page.locator(
      'label[for=":r1f:"] input[type="checkbox"]',
    );
    await mainCheckbox.click();
    // Check if the "Delete" button is disabled
    await dashboardsPage.expectDeleteButtonDisabled();
    // Assert that delete button is disabled
    await expect(dashboardsPage.deleteButton).toBeDisabled();

    //Now delete the dashboard after asserting
    await deleteDashboard(page, 'My dashboard', dashboardDescription);

    // Select the first row to delete
    const firstRowCheckbox = page.locator(
      "//tr[@data-selection-item='item'][1]//input[@type='checkbox']",
    );
    await firstRowCheckbox.click();
    // Click the delete button to open the delete confirmation dialog
    await dashboardsPage.deleteButton.click();
    // Click the delete button in the dialog
    await deleteDashboardDialog.deleteButton.click();
  });

  // Negative scenario - Click multiple id's to check the view button availability
  test('click multiple ids to check the view button availability', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);
    const deleteDashboardDialog = new DeleteDashboardDialog(page);
    const preferencesDialog = new PreferencesDialog(page);

    //Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Navigate to dashboard page
    await dashboardsPage.goto();

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );
    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    //For selecting multiple rows checking the View Button, navigate to the dashboard page
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Click the main checkbox to select multiple dashboards
    const mainCheckbox = page.locator(
      'label[for=":r1f:"] input[type="checkbox"]',
    );
    await mainCheckbox.click();
    // Check if the "View" button is disabled
    await dashboardsPage.expectViewButtonDisabled();
    // Assert that view button is disabled
    await expect(dashboardsPage.viewButton).toBeDisabled();

    //Now delete the dashboard after asserting
    await deleteDashboard(page, 'My dashboard', dashboardDescription);

    // Select the first row to delete
    const firstRowCheckbox = page.locator(
      "//tr[@data-selection-item='item'][1]//input[@type='checkbox']",
    );
    await firstRowCheckbox.click();
    // Click the delete button to open the delete confirmation dialog
    await dashboardsPage.deleteButton.click();
    // Click the delete button in the dialog
    await deleteDashboardDialog.deleteButton.click();
  });

  // Negative scenario - Click multiple id's to check the build button availability
  test('click multiple ids to check the build button availability', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);
    const deleteDashboardDialog = new DeleteDashboardDialog(page);
    const preferencesDialog = new PreferencesDialog(page);

    //Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Navigate to dashboard page
    await dashboardsPage.goto();

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );
    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    //For selecting multiple rows checking the Build Button, navigate to the dashboard page
    await dashboardsPage.goto();
    // Click the Preferences icon in dashboard
    await page.getByRole('button', { name: 'Preferences' }).click();
    // Click 100 dashboards in the Select page size
    await preferencesDialog.oneHundredDashboardsPageSizeOption.click();
    // Click confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Click the main checkbox to select multiple dashboards
    const mainCheckbox = page.locator(
      'label[for=":r1f:"] input[type="checkbox"]',
    );
    await mainCheckbox.click();
    // Check if the "Build" button is disabled
    await dashboardsPage.expectBuildButtonDisabled();
    // Assert that build button is disabled
    await expect(dashboardsPage.buildButton).toBeDisabled();

    //Now delete the dashboard after asserting
    await deleteDashboard(page, 'My dashboard', dashboardDescription);

    // Select the first row to delete
    const firstRowCheckbox = page.locator(
      "//tr[@data-selection-item='item'][1]//input[@type='checkbox']",
    );
    await firstRowCheckbox.click();
    // Click the delete button to open the delete confirmation dialog
    await dashboardsPage.deleteButton.click();
    // Click the delete button in the dialog
    await deleteDashboardDialog.deleteButton.click();
  });
});
