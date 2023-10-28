import { test, expect } from '@playwright/test';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from '../accessibility/delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can save the dashboard ', async ({ page }) => {
    const application = new ApplicationFrame(page);
    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    await page.getByRole('button', { name: 'Preview' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: 'Time machine' }).click();
    await page.getByRole('radio', { name: 'Last 5 minutes' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toHaveText(
      'Successfully updated dashboard "My Dashboard".',
    );
    // Accessibility test for click Save button
    //Once ES lint rules are updated can use console.log
    // console.log('Acessibility issues for click Save button : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
