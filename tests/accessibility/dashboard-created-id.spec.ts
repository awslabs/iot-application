import { test, expect } from '@playwright/test';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { randomUUID } from 'crypto';
import { accessibilityTest } from './accessibility';

test.skip(' Accessibility > As a user, I can create an id in create dashboard page ', async ({
  page,
}) => {
  const createDashboardPage = new CreateDashboardPage(page);
  const application = new ApplicationFrame(page);
  const dashboardDescription = `My dashboard description ${randomUUID()}`;

  // Navigate to the create dashboard page for the accessibility test
  await createDashboardPage.goto();

  //Accessbility test for Create Dashboard
  //Once ES lint rules are updated can use console.log
  // console.log('Create Dashboard Accessibility Issues : ');
  await accessibilityTest(page);

  // Fill out the form and create a dashboard
  await createDashboardPage.nameField.type('My Dashboard');
  await createDashboardPage.descriptionField.type(dashboardDescription);
  await expect(application.notification).toBeHidden();
  await createDashboardPage.createButton.click();

  // Wait for the new URL to be loaded
  await page.waitForURL(/dashboards\/[a-zA-Z0-9_-]{12}/);

  // Accessibility test for Created ID page
  //Once ES lint rules are updated can use console.log
  // console.log('Created ID page Accessibility Issues : ');
  await accessibilityTest(page);
});
