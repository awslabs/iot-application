import { test, expect } from '@playwright/test';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from '../accessibility/delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can preview the dashboard ', async ({ page }) => {
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
    // Accessibility test for Preview Page
    //Once ES lint rules are updated can use console.log
    // console.log('Acessibility issues for Preview page : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
