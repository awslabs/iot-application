import { expect, test } from '@playwright/test';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';
import { accessibilityTest } from './accessibility';

test(' Create dashboard empty button in Dashboard Accessibility Test', async ({
  page,
}) => {
  // Create an instance for the DashboardIndexPage class
  const dashboardsIndexPage = new DashboardsIndexPage(page);

  // Now navigate to the dashboard index page
  await dashboardsIndexPage.goto();

  // Try clicking the "Create Dashboard" button for an empty dashboard
  try {
    const createDashboardButton = page.getByRole('button', {
      name: 'Create Dashboard',
    });
    await createDashboardButton.click();
  } catch (error) {
    // If the above click fails, catch the error, and click the "Create" button in the Dashboard Index
    const createButton = page.getByRole('button', { name: 'Create' });
    await createButton.click();
  }

  //Verify if the create dashboard page is opened
  await expect(page).toHaveURL('dashboards/create');

  //Accessibility test for click Create dashboard empty button
  console.log(
    'Accessibility Issues for click Create dashboard empty button : ',
  );
  await accessibilityTest(page);
});
