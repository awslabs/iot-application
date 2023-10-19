import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test.skip(' Accessibility > As a user, I can preview the dashboard ', async ({
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
  // Accessibility test for Preview Page
  //Once ES lint rules are updated can use console.log
  // console.log('Acessibility issues for Edit page : ');
  await accessibilityTest(page);
});
