import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';
import { deleteDashboard } from './delete-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can edit dashboard using collapsed panels in resource explorer browse tab for asset properties in modeled tab', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;
    const closeButton = page.locator('button[aria-label="Cancel"]');

    await createDashboardPage.goto();
    await createDashboardPage.nameField.type('My Dashboard');
    await createDashboardPage.descriptionField.type(dashboardDescription);
    await expect(application.notification).toBeHidden();
    await createDashboardPage.createButton.click();
    await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click left side img for Resource Explorer
    await page.click('[data-testid="collapsed-left-panel-icon"]');
    //Click Settings icon in Modeled tab Browse for Asset preferences in Resource Explorer
    await page.getByRole('button', { name: 'Asset preferences' }).click();
    //Accessibility test for browse tab asset properties in modeled tab
    await accessibilityTest(page);
    //Click Close Button (X) for Settings
    await closeButton.click();

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  test.skip(' As a user, I can edit dashboard using collapsed panels in resource explorer browse tab for asset property preferences in modeled tab', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;
    const closeButton = page.locator('button[aria-label="Cancel"]');

    await createDashboardPage.goto();
    await createDashboardPage.nameField.type('My Dashboard');
    await createDashboardPage.descriptionField.type(dashboardDescription);
    await expect(application.notification).toBeHidden();
    await createDashboardPage.createButton.click();
    await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click left side img for Resource Explorer
    await page.click('[data-testid="collapsed-left-panel-icon"]');
    //Click Settings icon in Modeled tab Browse for Asset property preferences in Resource Explorer
    await page
      .getByRole('button', { name: 'Asset property preferences' })
      .click();
    //Accessibility test for browse tab asset property preferences in modeled tab
    await accessibilityTest(page);
    //Click Close Button (X) for Settings
    await closeButton.click();

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  test.skip(' As a user, I can edit dashboard using collapsed panels in resource explorer search in modeled tab ', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    await createDashboardPage.goto();
    await createDashboardPage.nameField.type('My Dashboard');
    await createDashboardPage.descriptionField.type(dashboardDescription);
    await expect(application.notification).toBeHidden();
    await createDashboardPage.createButton.click();
    await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click left side img for Resource Explorer
    await page.click('[data-testid="collapsed-left-panel-icon"]');
    //Click Settings icon in Modeled tab Search in Resource Explorer
    await page.getByRole('button', { name: 'Search' }).click();
    //Accessibility test for Modeled tab Search
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  test.skip(' As a user, I can edit dashboard using collapsed panels in resource explorer unmodeled tab ', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    await createDashboardPage.goto();
    await createDashboardPage.nameField.type('My Dashboard');
    await createDashboardPage.descriptionField.type(dashboardDescription);
    await expect(application.notification).toBeHidden();
    await createDashboardPage.createButton.click();
    await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click left side img for Resource Explorer
    await page.click('[data-testid="collapsed-left-panel-icon"]');
    //Click UnModeled tab Search in Resource Explorer
    await page.click('[data-testid="explore-unmodeled-tab"]');
    //Accessibility test for Unmodeled tab
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });

  test.skip(' As a user, I can edit dashboard using collapsed panels for configuration ', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    await createDashboardPage.goto();
    await createDashboardPage.nameField.type('My Dashboard');
    await createDashboardPage.descriptionField.type(dashboardDescription);
    await expect(application.notification).toBeHidden();
    await createDashboardPage.createButton.click();
    await expect(page).toHaveURL(/dashboards\/[a-zA-Z0-9_-]{12}/);
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click right side img for Configuration
    await page.click('[data-testid="collapsed-right-panel-icon"]');
    // Accessibility test for Edit page collapsed panels for Configuration
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
