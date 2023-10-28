import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility-utils';
import { deleteDashboard } from '../accessibility/delete-utils';
import { createDashboard } from '../accessibility/create-utils';

test.describe('Accessibility', () => {
  test.skip(' As a user, I can create an id in create dashboard page ', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);
    const application = new ApplicationFrame(page);
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    // Navigate to the create dashboard page for the accessibility test
    await createDashboardPage.goto();

    //Create the dashboard
    await createDashboard(page, dashboardDescription);
    await expect(application.notification).toContainText(
      'Successfully created dashboard "My Dashboard".',
    );

    // Accessibility test for Created ID page
    //Once ES lint rules are updated can use console.log
    // console.log('Accessibility Issues for Created ID page : ');
    await accessibilityTest(page);

    //Delete the created dashboard
    await deleteDashboard(page, 'My dashboard', dashboardDescription);
  });
});
