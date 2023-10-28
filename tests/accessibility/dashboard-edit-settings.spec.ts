import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';
import { deleteDashboard } from './delete-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can check settings in edit page', async ({
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
    //Click Settings icon in Edit page
    const settingsIcon = page.locator(
      'button[type=submit].awsui_button_vjswe_1j0eq_101.awsui_variant-icon_vjswe_1j0eq_166.awsui_button-no-text_vjswe_1j0eq_971',
    );
    await settingsIcon.click();
    // Accessibility test for Settings in Edit page
    //Once ES lint rules are updated can use console.log
    // console.log('Acessibility issues for Settings in Edit page : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
