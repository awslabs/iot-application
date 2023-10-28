import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { accessibilityTest } from './accessibility-utils';

test.describe('Accessibility', () => {
  test.skip('As a user, I can verify Create Dashboard Page ', async ({
    page,
  }) => {
    const createDashboardPage = new CreateDashboardPage(page);

    //Now navigate to the create dashboard page url
    await createDashboardPage.goto();

    // Verify the dashboard is opened
    await expect(page).toHaveURL('/dashboards/create');

    //Accessibility test for Create Dashboard Page
    //Once ES lint rules are updated can use console.log
    // console.log('Accessibility Issues for Create dashboard page : ');
    await accessibilityTest(page);
  });
});
