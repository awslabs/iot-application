import { test, expect } from '@playwright/test';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from '../accessibility/delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can check settings in edit page', async ({
    page,
  }) => {
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // check if viewport setting persists
    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    //Click Settings icon in Edit page

    await page.locator('.awsui_variant-icon_vjswe_1u1vg_165').click();
    // Accessibility test for Settings in Edit page
    //Once ES lint rules are updated can use console.log
    // console.log('Acessibility issues for Settings in Edit page : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
