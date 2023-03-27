import { test, expect } from '@playwright/test';
import { ApplicationFrame } from '../pages/application-frame.page';
import { CreateDashboardPage } from '../pages/create-dashboard.page';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';

test('as a user, I cannot create an invalid dashboard', async ({ page }) => {
  const createPage = new CreateDashboardPage(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const application = new ApplicationFrame(page);

  await createPage.goto();
  await createPage.expectIsCurrentPage();

  // user does not initial see errors
  await expect(createPage.nameRequiredError).not.toBeVisible();
  await expect(createPage.descriptionRequiredError).not.toBeVisible();

  // user tries to create a dashboard without entering name or description
  await createPage.createButton.click();

  // user is not redirected to dashboards page
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();

  // user sees validation errors for name and description
  await expect(createPage.nameRequiredError).toBeVisible();
  await expect(createPage.descriptionRequiredError).toBeVisible();

  // user types a single character for the name
  await createPage.nameField.type('a');

  // user sees the name required validation error immediately disappear
  await expect(createPage.nameRequiredError).not.toBeVisible();

  // user tries and fails to create a dashboard without a description
  await createPage.createButton.click();
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
  await expect(application.notification).not.toBeVisible();

  // user types a single character for the description
  await createPage.descriptionField.type('a');

  // user sees the description required validation error immediately disappear
  await expect(createPage.descriptionRequiredError).not.toBeVisible();

  // user deletes name
  await createPage.nameField.clear();

  // user tries and fails to create a dashboard without a name
  await createPage.createButton.click();
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
  await expect(application.notification).not.toBeVisible();

  // user enters the max length name
  await createPage.nameField.click();
  await createPage.typeMaxLengthName();

  // user does not see a name validation error
  await expect(createPage.nameMaxLengthError).not.toBeVisible();

  // user enters the max length description
  await createPage.descriptionField.clear();
  await createPage.typeMaxLengthDescription();

  // user does not see a description validation error
  await expect(createPage.descriptionMaxLengthError).not.toBeVisible();

  // user adds an extra character to name
  await createPage.nameField.type('a');

  // user sees a max length name validation error
  await expect(createPage.nameMaxLengthError).toBeVisible();

  // user tries and fails to create a dashboard with a name too long
  await createPage.createButton.click();
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
  await expect(application.notification).not.toBeVisible();

  // user removes a character from name
  await createPage.nameField.press('Delete');

  // user does not see a max length name validation error
  await expect(createPage.nameMaxLengthError).not.toBeVisible();

  // user adds an extra character to description
  await createPage.descriptionField.type('a');

  // user sees a max length description validation error
  await expect(createPage.descriptionMaxLengthError).toBeVisible();

  // user tries and files to create a dashboard with a description too long
  await createPage.createButton.click();
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
  await expect(application.notification).not.toBeVisible();

  // user removes a character from description
  await createPage.descriptionField.press('Backspace');

  // user does not see a max length description validation error
  await expect(createPage.descriptionMaxLengthError).not.toBeVisible();
});

test('as a user, I cancel creating a dashboard', async ({ page }) => {
  const createPage = new CreateDashboardPage(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const application = new ApplicationFrame(page);

  await createPage.goto();
  await createPage.expectIsCurrentPage();

  // user enters a dashboard name and description
  await createPage.nameField.type('name');
  await createPage.descriptionField.type('description');

  // user backs out of creating a dashboard
  await createPage.cancelButton.click();

  // user is back on the dashboards page without a new dashboard created
  await dashboardsPage.expectIsCurrentPage();
  await createPage.expectIsNotCurrentPage();
  await expect(application.notification).not.toBeVisible();
});

test('as a user, I see a error notification when creation of a valid dashboard fails', async ({
  page,
}) => {
  const createPage = new CreateDashboardPage(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const application = new ApplicationFrame(page);

  // return a 500 status code when creating a dashboard
  await page.route('http://localhost:3000/dashboards', async (route) => {
    route.fulfill({
      status: 500,
    });
  });

  await createPage.goto();
  await createPage.expectIsCurrentPage();

  // user enters a dashboard name and description
  await createPage.nameField.type('name');
  await createPage.descriptionField.type('description');

  // user attempts to create dashboard
  await createPage.createButton.click();

  // user sees error notification
  await expect(application.notification).toBeVisible();
  await expect(application.notification).toHaveText('Internal Server Error');
  await createPage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
});

const errors = [
  { status: 400, message: 'Bad Request' },
  { status: 401, message: 'Unauthorized' },
  { status: 403, message: 'Forbidden' },
];

for (const { status, message } of errors) {
  test(`as a user, I see a form error when dashboard creation fails for status: ${status}`, async ({
    page,
  }) => {
    const createPage = new CreateDashboardPage(page);
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);

    // return status code when creating a dashboard
    await page.route('http://localhost:3000/dashboards', async (route) => {
      route.fulfill({
        status: status,
      });
    });

    await createPage.goto();
    await createPage.expectIsCurrentPage();

    // user enters a dashboard name and description
    await createPage.nameField.type('name');
    await createPage.descriptionField.type('description');

    // user attempts to create dashboard
    await createPage.createButton.click();

    // user sees form error
    await expect(page.getByText(message).nth(0)).toBeVisible();
    await expect(application.notification).not.toBeVisible();
    await createPage.expectIsCurrentPage();
    await dashboardsPage.expectIsNotCurrentPage();
  });
}
