import { expect, test } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import {
  DashboardsIndexPage,
  DashboardsTable,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test.skip(' Accessibility > As a user, I can click view button in dashboard ', async ({
  page,
}) => {
  const dashboardsPage = new DashboardsIndexPage(page);
  const createDashboardPage = new CreateDashboardPage(page);
  const dashboardsTable = new DashboardsTable(page);
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

  await dashboardsPage.goto();
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
  await dashboardsPage.viewButton.click();

  //Accessibility test for View Button in Dashboard page
  //Once ES lint rules are updated can use console.log
  //  console.log('Accessibility Issues for View in Dashboard : ');
  await accessibilityTest(page);
});
